require 'ffi'

module SpaLibrary
  extend FFI::Library
  ffi_lib File.join(File.expand_path(File.join(File.dirname(__FILE__))), 'spa.so')

  class SpaObject < FFI::Struct
    layout :year          , :int,
           :month         , :int,
           :day           , :int,
           :hour          , :int,
           :minute        , :int,
           :second        , :double,
           :delta_ut1     , :double,
           :delta_t       , :double,
           :timezone      , :double,
           :longitude     , :double,  
           :latitude      , :double,  
           :elevation     , :double,
           :pressure      , :double,
           :temperature   , :double,
           :slope         , :double,
           :azm_rotation  , :double,
           :atmos_refract , :double,
           :function      , :int   ,
           :jd            , :double,
           :jc            , :double,
           :jde           , :double,
           :jce           , :double,
           :jme           , :double,
           :l             , :double,
           :b             , :double,
           :r             , :double,
           :theta         , :double,
           :beta          , :double,
           :x0            , :double,
           :x1            , :double,
           :x2            , :double,
           :x3            , :double,
           :x4            , :double,
           :delta_psi     , :double,
           :delta_epsilon , :double,
           :epsilon0      , :double,
           :epsilon       , :double,
           :del_tau       , :double,
           :lambda        , :double,
           :nu0           , :double,
           :nu            , :double,
           :alpha         , :double,
           :delta         , :double,
           :h             , :double,
           :xi            , :double,
           :delta_alpha   , :double,
           :delta_prime   , :double,
           :alpha_prime   , :double,
           :h_prime       , :double,
           :e0            , :double,
           :del_e         , :double,
           :e             , :double,
           :eot           , :double,
           :srha          , :double,
           :ssha          , :double,
           :sta           , :double,
           :zenith        , :double,
           :azimuth_astro , :double,
           :azimuth       , :double,
           :incidence     , :double,
           :suntransit    , :double,
           :sunrise       , :double,
           :sunset        , :double
  end

  attach_function :spa_calculate, [:pointer], :int

  def self.init spa
    spa[:minute] = 0
    spa[:second] = 0
    # diferenta de timp http://en.wikipedia.org/wiki/%CE%94T_%28disambiguation%29    
    spa[:delta_ut1]     = 0.0;
    spa[:delta_t]       = 64.797;
    spa[:elevation]     = 300;
    spa[:pressure]      = 835; # Affects the topometric elevation angle quite greatly
    spa[:temperature]   = 10;
    spa[:slope]         = 30;
    spa[:azm_rotation]  = 180;
    spa[:atmos_refract] = 0.5667;
    spa[:function]      = 4;
  end  
  def self.calculate year, month, day, timezone, latitude, longitude, elevation

    spa = SpaObject.new
    init spa
    spa[:year] = year
    spa[:month] = month
    spa[:day] = day
    spa[:timezone] = timezone;
    spa[:longitude] = longitude;
    spa[:latitude] = latitude;
    (0..23).each do |hour|
      (0..5).each do |multiplier|
        minute = multiplier * 10
        spa[:hour] = hour
        spa[:minute] = minute
        result = spa_calculate spa
        output = spa[:hour].to_s.rjust(2,'0') + ":" + spa[:minute].to_s.rjust(2,'0')
        output = output + " " + spa[:e].to_s + " " + spa[:azimuth].to_s
        # output = output + " " + (spa[:delta_ut1] <= -1 || spa[:delta_ut1] >= 1).to_s
        # output = output + " " + spa[:timezone].to_s
        puts output
      end
    end
  end
end
puts "Loaded"

#SpaLibrary.calculate 2015, 4, 9, 3, 44.852, 24.937, 300