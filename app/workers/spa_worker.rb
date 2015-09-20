# app/workers/spa_worker.rb
require File.join(File.expand_path(File.join(File.dirname(__FILE__))), 'spa.rb')

class SpaWorker
  include Sidekiq::Worker

  def perform(date_id)
    altitude = 300
    date = Day.includes(:location).find(date_id)
    angles = SpaLibrary.calculate date.year,
                                  date.month,
                                  date.day,
                                  date.offset,
                                  date.location.latitude,
                                  date.location.longitude,
                                  altitude
    date.update angles: angles
  end
end