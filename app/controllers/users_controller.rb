class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_resource!

  def show
    @current_location = current_user.current_location
    @location = Location.new
    @location.user_id = current_user.id
  end

  private

    def authorize_resource!      
      if !params[:id]
        redirect_to user_path current_user
        flash[:alert] = "You are not allowed to access another user's data!"
      elsif current_user.id != params[:id].to_i
        redirect_to user_path current_user
        flash[:alert] = "You are not allowed to access another user's data!"
      end    
    end
end
