class UsersController < ApplicationController
  before_action :authenticate_user!

  def show
    @location = current_user.locations.first
    @location ||= Location.new
  end
end
