# app/workers/spa_worker.rb
class SpaWorker
  include Sidekiq::Worker

  def perform(name, count)
    puts 'Doing hard work' + name
  end
end