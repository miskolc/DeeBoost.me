class Numeric
    #Degrees to radians.
    def to_rad
        self * Math::PI / 180.0
    end
    #Radians to degrees.
    def to_deg
        self * 180.0 / Math::PI
    end

    def hours
      60.0 * self.minutes
    end

    def minutes
      60.0 * self
    end
end
class Float
    alias_method :round_orig, :round
    def round(n=0)
        (self * (10.0 ** n)).round_orig * (10.0 ** (-n))
    end
end