# app/workers/spa_worker.rb
require File.join(File.expand_path(File.join(File.dirname(__FILE__))), 'spa.rb')

class SpaWorker
  include Sidekiq::Worker

  def perform(location_id)
    puts 'Doing hard work' + File.join(File.expand_path(File.join(File.dirname(__FILE__))), 'spa.rb')
    location = Location.find(location_id)
    date = DateTime.now
    angles = SpaLibrary.calculate date.year, date.month, date.day, 3, 44.852, 24.937, 300
    location.days.create date: date, angles: angles
  end
end