module LocationsHelper
  def addition_date_for location
    "#{time_ago_in_words location.created_at} ago" 
  end
end
