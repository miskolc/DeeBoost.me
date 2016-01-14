class ContactMailer < ApplicationMailer
  def send_email(sender, message)
    @message = message
    mail(to:  "anthony.mayer.74@gmail.com",
         from: sender,
         subject: "Contact Form Message" )
  end
end
