class Location < ActiveRecord::Base
  belongs_to :user 
  has_many :days
  after_commit :transaction_success
  after_rollback :transaction_failed

  def set_current_location new_current_location
    previous_current_location = self
    previous_current_location.current_location = false
    new_current_location.current_location = true
    Location.transaction do
      previous_current_location.save!
      new_current_location.save!
    end
    new_current_location
  end

  private
    def transaction_success
      logger.info "Current Location Update succeed for Location #{self.to_param}"
    end

    def transaction_failed
      logger.warn "Current Location Update failed for Location #{self.to_param}"
    end  
end
