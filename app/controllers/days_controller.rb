class DaysController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_resource!

  def show
    @day = Day.find(params[:id])
    respond_to do |format|
      format.json {render json: @day }
    end
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
