class AddEquipmentToDesks < ActiveRecord::Migration[6.0]
  def change
    add_column :desks, :equipment, :string
  end
end
