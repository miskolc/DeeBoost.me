class ContactsController < ApplicationController
  def send_message
    sender = params[:email]
    message = params[:message]
    ContactMailer.send_email(sender, message).deliver_later
    flash[:notice] = "Message sent successfully!"
    redirect_to contact_path
  end
end