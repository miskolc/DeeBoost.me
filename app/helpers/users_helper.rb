module UsersHelper
  def page_classes
    "#{params[:controller]} #{params[:action]}"
  end
end
