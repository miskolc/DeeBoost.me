class LocationsController < ApplicationController
  before_action :authenticate_user!

  def create
    @location = current_user.locations.build location_params
    @location.save
    unless current_user.current_location.id == @location.id
      current_user.current_location.set_current_location @location    
    end
    @day = @location.days.create day_params
    SpaWorker.perform_async(@day.id)
    respond_to do |format|
      format.js
    end
  end

  def show
    @location = Location.where(user_id: current_user.id).first
    respond_to do |format|
      format.json {render json: @location }
    end
  end

  private

    def location_params
      params.require(:location).permit(:longitude, :latitude, :current_location)
    end

    def day_params
      params.require(:date_time).permit(:year, :day, :month, :timezone)
    end
end
