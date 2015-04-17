class UsersController < ApplicationController
  before_action :authenticate_user!

  def show
    @current_location = current_user.locations.first
    @location = Location.new
    @location.user_id = current_user.id
  end
end
