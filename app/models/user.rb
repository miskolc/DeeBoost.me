class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable
  has_many :locations

  def current_location
    self.locations.find_by current_location: true
  end

  def locations_for page
    locations.paginate(page: page, :per_page => 5).order("current_location DESC, updated_at DESC")
  end

end
