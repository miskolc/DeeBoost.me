require File.join(File.expand_path(File.join(File.dirname(__FILE__))), 'extensions.rb')

module Solar
  class Calculator
    attr_accessor :latitude, :longitude, :offset
    attr_accessor :year, :month, :day
    attr_accessor :pressure, :temperature, :atmos_refract

    SUN_RADIUS = 0.26667

    def initialize params
      @latitude = params[:latitude]
      @longitude = params[:longitude]
      @offset = params[:offset]
      @year = params[:year]
      @month = params[:month]
      @day = params[:day]
      @pressure = params[:pressure] || 835
      @temperature = params[:temperature] || 10
      @atmos_refract = params[:atmos_refract] || 0.5667
    end

    def elevation_angle_now
      longitude_in_hours = calculate_longitude_in_hours
      time = Time.now.utc
      julian_day = calculate_julian_day time
      time_in_julian_centuries = calculate_time_in_julian_centuries julian_day
      sun_true_logitude = calculate_sun_true_longitude time_in_julian_centuries
      omega = calculate_omega time_in_julian_centuries
      sun_apparant_longitude = calculate_sun_apparant_longitude sun_true_logitude, omega
      obliquity_of_ecliptic = calculate_obliquity_of_ecliptic time_in_julian_centuries, omega
      sun_declination = calculate_sun_declination obliquity_of_ecliptic, sun_apparant_longitude
      sun_right_ascension = calculate_sun_right_ascension obliquity_of_ecliptic, sun_apparant_longitude
      sidereal_time = calculate_sidereal_time julian_day, time_in_julian_centuries
      local_hour_angle = calculate_local_hour_angle longitude_in_hours, sidereal_time, sun_right_ascension
      altitude = elevation sun_declination, local_hour_angle
    end

    def elevation_angle_at hour, minute = 0
      longitude_in_hours = calculate_longitude_in_hours
      time = Time.utc(@year, @month, @day, hour, minute) - @offset.hours
      julian_day = calculate_julian_day time
      time_in_julian_centuries = calculate_time_in_julian_centuries julian_day
      sun_true_logitude = calculate_sun_true_longitude time_in_julian_centuries
      omega = calculate_omega time_in_julian_centuries
      sun_apparant_longitude = calculate_sun_apparant_longitude sun_true_logitude, omega
      obliquity_of_ecliptic = calculate_obliquity_of_ecliptic time_in_julian_centuries, omega
      sun_declination = calculate_sun_declination obliquity_of_ecliptic, sun_apparant_longitude
      sun_right_ascension = calculate_sun_right_ascension obliquity_of_ecliptic, sun_apparant_longitude
      sidereal_time = calculate_sidereal_time julian_day, time_in_julian_centuries
      local_hour_angle = calculate_local_hour_angle longitude_in_hours, sidereal_time, sun_right_ascension
      altitude = elevation sun_declination, local_hour_angle
    end

    def corrected_elevation_angle e0
      delta_e = athmospheric_refraction_correction e0
      corrected_elevation e0, delta_e
    end

    def calculate_corrected_angles
      angles = calculate_angles
      angles.each do |angle|
        angle[:elevation_angle] = corrected_elevation_angle(angle[:elevation_angle])
      end
      angles
    end

    def get_angles_collection
      angles = []
      (0..23).each do |hour|
        (0..5).map{|minutes| 10 * minutes}.each do |minute|
          angle = {hour: hour, minute: minute, elevation_angle: nil}
          angles.push angle
        end
      end
      angles
    end

    def calculate_angles
      angles = get_angles_collection
      angles.each do |angle|
        angle[:elevation_angle] = elevation_angle_at angle[:hour], angle[:minute]
      end
      angles
    end

    private

      def calculate_longitude_in_hours
        (@longitude*-1)/15
      end

      def calculate_julian_day t
        ######################
        # Begin Julian Day Calculation (Meeus Pages 59-61) vvvv
        y = t.gmtime.year
        m = t.gmtime.month
        d = t.gmtime.day + t.gmtime.hour/24.to_f + t.gmtime.min/1440.to_f + t.gmtime.sec/86400.to_f
        if m > 2
          y=y
          m=m
        else
          y = y-1
          m = m+12
        end
        a = (y/100).to_int
        b = 2 - a + (a/4).to_int
        jd = (365.25 * (y+4716)).to_int + (30.6001 * (m+1)).to_int + d + b + -1524.5
        # End Julian Day Calculation^^^^
        ######################
      end

      def calculate_time_in_julian_centuries jd
        ################
        # (Meeus Pages 163-164) vvv
        #Time in Julian Centuries
        t = ((jd - 2451545.0)/36525.0)
      end

      def calculate_sun_true_longitude t
        #Mean equinox of the date
        l = 280.46645 + 36000.76983*t + 0.0003032*t**2
        #Mean Anomaly of the Sun
        m = 357.52910 + 35999.05030 *t - 0.0001559 *t**2 - 0.00000048*t**3
        #Eccentricity of the Earth's Orbit
        e = 0.016708617 - 0.000042037*t - 0.0000001236*t**2
        # Sun's Equation of the center
        c = (1.914600 - 0.004817 *t - 0.000014 * t**2) * Math.sin(m.to_rad) + (0.019993 - 0.000101*t) * Math.sin(2*m.to_rad) + 0.000290*Math.sin(3*m.to_rad)
        #Sun's True Longitude
        o = l +c
        #Brings 'o' within + or - 360 degrees. (Taking an inverse function of very large numbers can sometimes lead to slight errors in output)
        o=o.divmod(360)[1]
        ################
      end

      def calculate_omega t
        omega = 125.04 - 1934.136*t
      end

      def calculate_sun_apparant_longitude o, omega
        ###############
        #(Meeus Page 164)
        #Sun's Apparant Longitude (The Output of Lambda)
        lambda = o - 0.00569 - 0.00478 * Math.sin(omega.to_rad)
        #Brings 'lambda' within + or - 360 degrees. (Taking an inverse function of very large numbers can sometimes lead to slight errors in output)
        lambda = lambda.divmod(360)[1]
        ###############
      end

      def calculate_obliquity_of_ecliptic t, omega
        #Obliquity of the Ecliptic (Meeus page 147) (numbers switched from degree minute second in book to decimal degree)
        epsilon = (23.4392966666667 - 0.012777777777777778*t - 0.00059/60.to_f * t**2 + 0.00059/60.to_f * t**3) + (0.00256 * Math.cos(omega.to_rad))
      end

      def calculate_sun_declination epsilon, lambda
        #Sun's Declination (Meeus page 165)
        delta = Math.asin(Math.sin(epsilon.to_rad)*Math.sin(lambda.to_rad)).to_deg
      end

      def calculate_sun_right_ascension epsilon, lambda
        alpha = Math.atan2(((Math.cos(epsilon.to_rad) * Math.sin(lambda.to_rad))),(Math.cos(lambda.to_rad))).to_deg/15
        if alpha < 0
          alpha = alpha + 24
        end
        alpha
      end

      def calculate_sidereal_time jd, t
        #Sidereal Time (Meeus Page 88)
        theta = (280.46061837 + 360.98564736629 * (jd-2451545.0) + 0.000387933*t**2 - ((t**3)/38710000))/15.to_f
        #Brings 'theta' within + or - 360 degrees. (Taking an inverse function of very large numbers can sometimes lead to slight errors in output)
        theta = theta.divmod(360)[1]
      end

      def calculate_local_hour_angle longitude, theta, alpha
        #The Local Hour Angle (Meeus Page 92) (multiplied by 15 to convert to degrees)
        h = (theta - longitude - alpha)*15
        #Brings 'h' within + or - 360 degrees. (Taking an inverse function of very large numbers can sometimes lead to slight errors in output)
        h =h.divmod(360)[1]
      end

      def elevation delta, h
        Math.asin(Math.sin(@latitude.to_rad) *
        Math.sin(delta.to_rad) +
        Math.cos(@latitude.to_rad) *
        Math.cos(delta.to_rad) *
        Math.cos(h.to_rad)).to_deg
      end

      def athmospheric_refraction_correction e0
        delta_e = 0

        if(e0 > -1 * (SUN_RADIUS + @atmos_refract))
          delta_e = (@pressure / 1010.0) *
                    (283.0 / (273.0 + @temperature)) *
                    1.02 / (60.0 * Math.tan((e0 + 10.3 / (e0 + 5.11)).to_rad))
        end

        delta_e
      end

      def corrected_elevation e0, delta_e
        e0 + delta_e
      end
  end
end