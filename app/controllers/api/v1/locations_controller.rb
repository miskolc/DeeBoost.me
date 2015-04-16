class Api::V1::LocationsController < ApplicationController
  before_action :authenticate_user!

  def create
  end

  def show
    @location = Location.where(user_id: current_user.id).first
    respond_to do |format|
      format.json {render json: @location }
    end
  end
end
