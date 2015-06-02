class AddCurrentLocationToLocations < ActiveRecord::Migration
  def change
    add_column :locations, :current_location, :boolean, default: false
  end
end
