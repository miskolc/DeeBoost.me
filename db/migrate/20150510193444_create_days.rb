class CreateDays < ActiveRecord::Migration
  def change
    create_table :days do |t|
      t.integer :location_id
      t.integer :year
      t.integer :day
      t.integer :month
      t.float :timezone
      t.json :angles

      t.timestamps null: false
    end
  end
end
