class LocationsController < ApplicationController
  before_action :authenticate_user!
  layout 'users'

  def index
    @locations = current_user.locations.paginate(page: params[:page], :per_page => 5).order("current_location DESC, id DESC")
  end

  def create
    @new_location = current_user.locations.build location_params
    @new_location.save
    unless current_user.current_location.id == @new_location.id
      current_user.current_location.set_current_location @new_location    
    end
    @day = @new_location.days.create day_params
    SpaWorker.perform_async(@day.id)
    @current_location = current_user.current_location
    @location = Location.new
    @location.user_id = current_user.id
    redirect_to root_path
    # respond_to do |format|
    #   format.js
    # end
  end

  def update
    @new_location = current_user.locations.find_by id: params[:id]
    @old_location = current_user.current_location
    current_user.current_location.set_current_location @new_location
    @old_location.current_location = false
    respond_to do |format|
      format.js
    end
  end

  def post_update
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

  def destroy
    @location = current_user.locations.find_by id: params[:id]
    @location.destroy
    respond_to do |format|
      format.js
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
