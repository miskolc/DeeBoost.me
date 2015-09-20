class RenameTimezoneToOffsetInDays < ActiveRecord::Migration
  def change
    change_table :days do |t|
      t.rename :timezone, :offset
    end
  end
end
