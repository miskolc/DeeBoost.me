module LocationsHelper
  def addition_date_for location
    location.created_at.to_s.split(" ").first.gsub('-','/')
  end
end
