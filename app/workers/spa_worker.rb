# app/workers/spa_worker.rb
require File.join(File.expand_path(File.join(File.dirname(__FILE__))), 'spa.rb')

class SpaWorker
  include Sidekiq::Worker

  def perform(date_id)
    date = Day.find(date_id)
    angles = SpaLibrary.calculate date.year, date.month, date.day, 3, 44.852, 24.937, 300
    date.update angles: angles
  end
end