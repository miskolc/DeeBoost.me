class GuestsPagesController < ApplicationController
  def index
    if user_signed_in?
      redirect_to current_user
    end
  end  

  def contact
  end
end
