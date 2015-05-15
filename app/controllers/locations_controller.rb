class LocationsController < ApplicationController
  before_action :authenticate_user!
  before_action :parse_date_time, only: :create

  def create
    @location = current_user.locations.build location_params
    @location.save    
    @day = @location.days.create date: @date
    SpaWorker.perform_async(@day.id)
    redirect_to current_user
  end

  def show
    @location = Location.where(user_id: current_user.id).first
    respond_to do |format|
      format.json {render json: @location }
    end
  end

  private

    def location_params
      params.require(:location).permit(:longitude, :latitude)
    end

    def parse_date_time
      date_time = params.require(:date_time).permit(:year, :day, :month, :timezone)
      @date = DateTime.new
      @date = @date.change year: date_time[:year].to_i,
                           day: date_time[:day].to_i,
                           month: date_time[:month].to_i,
                           offset: date_time[:timezone]
    end
end
