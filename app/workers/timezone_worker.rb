class TimezoneWorker
  include Sidekiq::Worker

  def perform(location_id)
    location = Location.find location_id
    iana_timezone = GoogleTimezone.fetch(location.latitude, location.longitude).time_zone_id
    location.timezone = iana_timezone
    location.save
  end
end