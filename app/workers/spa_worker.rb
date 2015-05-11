# app/workers/spa_worker.rb
require File.join(File.expand_path(File.join(File.dirname(__FILE__))), 'spa.rb')

class SpaWorker
  include Sidekiq::Worker

  def perform(name, count)
    puts 'Doing hard work' + File.join(File.expand_path(File.join(File.dirname(__FILE__))), 'spa.rb')
    date = Date.current
    SpaLibrary.calculate date.year, date.month, date.day, 3, 44.852, 24.937, 300
  end
end