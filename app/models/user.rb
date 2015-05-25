class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable
  has_many :locations

  def update_location location_params
    previous_current_location = self.current_location
    previous_current_location.current_location = false
    new_current_location = self.locations.build location_params
    User.transaction do
      previous_current_location.save!
      new_current_location.save!
    end
    new_current_location
  end

  def current_location
    self.locations.find_by current_location: true
  end

end
