class Location < ActiveRecord::Base
  belongs_to :user 
  has_many :days
  after_commit :transaction_success
  after_rollback :transaction_failed

  private
    def transaction_success
      logger.info "Current Location Update succeed for Location #{self.to_param}"
    end

    def transaction_failed
      logger.warn "Current Location Update failed for Location #{self.to_param}"
    end  
end
