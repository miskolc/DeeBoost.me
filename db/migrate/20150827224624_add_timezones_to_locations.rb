class AddTimezonesToLocations < ActiveRecord::Migration
  def change
    add_column :locations, :summer_timezone, :float
    add_column :locations, :winter_timezone, :float
  end
end
