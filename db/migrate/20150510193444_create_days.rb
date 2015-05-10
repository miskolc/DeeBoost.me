class CreateDays < ActiveRecord::Migration
  def change
    create_table :days do |t|
      t.date :date
      t.json :angles

      t.timestamps null: false
    end
  end
end
