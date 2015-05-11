class AddLocationIdToDays < ActiveRecord::Migration
  def change
    add_column :days, :location_id, :integer
  end
end
