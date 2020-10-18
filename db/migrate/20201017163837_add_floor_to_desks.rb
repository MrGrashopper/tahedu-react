class AddFloorToDesks < ActiveRecord::Migration[6.0]
  def change
    add_column :desks, :floor, :integer, default: 0
  end
end
