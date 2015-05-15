class LocationsController < ApplicationController
  before_action :authenticate_user!

  def create
    @location = current_user.locations.build location_params
    @location.save    
    @day = @location.days.create day_params
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

    def day_params
      params.require(date_time).permit(:year, :day, :month, :timezone)
    end
end
