# app/workers/spa_worker.rb
require File.join(Rails.root, 'lib', 'solar', 'calculator.rb')

class SpaWorker
  include Sidekiq::Worker

  def perform(date_id)
    date = Day.includes(:location).find(date_id)
    params = set_params_for date
    calculator = Solar::Calculator.new params
    angles = calculator.calculate_corrected_angles
    date.update angles: angles
  end

  private

    def set_params_for(date)
      {
        latitude:   date.location.latitude,
        longitude:  date.location.longitude,
        offset:     date.offset,
        year:       date.year,
        month:      date.month,
        day:        date.day
      }
    end
end