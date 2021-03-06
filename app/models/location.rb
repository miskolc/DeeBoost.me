class Location < ActiveRecord::Base
  belongs_to :user 
  has_many :days
  reverse_geocoded_by :latitude, :longitude do |obj,results|
    if geo = results.first
      obj.address = geo.address
      obj.city    = geo.city
      obj.country = geo.country_code
    end
  end
  after_validation :reverse_geocode, if: ->(obj){ obj.latitude.present? and obj.longitude.present? }
  after_commit :transaction_success
  after_rollback :transaction_failed

  def set_current_location new_current_location
    previous_current_location = self
    previous_current_location.current_location = false
    new_current_location.current_location = true
    Location.transaction do
      previous_current_location.save!
      new_current_location.save!
    end
    new_current_location
  end

  def offset
    # Includes both offset from utc and daylight savings time offset
    iana_timezone = self.timezone
    ActiveSupport::TimeZone[iana_timezone].tzinfo.current_period.utc_total_offset / 3600.0
  end

  def self.update_day_for_user user
    location = user.current_location
    day = location.days.create new_day
    SpaWorker.perform_async day.id
  end

  def self.update_days
    new_day = self.new_day
    self.where( current_location: true
              ).find_each do |location|
                if location.offset == new_day[:offset]
                  day = location.days.create new_day
                  SpaWorker.perform_async day.id
                end
              end
  end

  def self.new_day
    current_time = DateTime.current

    # 15:15 becomes 15.25
    fractional_utc_time = current_time.hour
    fractional_utc_time += ((current_time.minute) / 15) * 0.25

    if fractional_utc_time <= 12
      # for regions West of London
      offset = -1 * fractional_utc_time
      new_day_time = current_time
    else
      # for regions Est of London
      offset = 24 - fractional_utc_time
      new_day_time = current_time.next_day
    end
    {
      offset: offset,
      day: new_day_time.day,
      month: new_day_time.month,
      year: new_day_time.year
    }
  end

  private
    def transaction_success
      logger.info "Current Location Update succeed for Location #{self.to_param}"
    end

    def transaction_failed
      logger.warn "Current Location Update failed for Location #{self.to_param}"
    end  
end
