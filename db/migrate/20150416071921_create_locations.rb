class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.integer :user_id
      t.float :latitude
      t.float :longitude
      t.string :address

      t.timestamps null: false
    end
  end
end
