class AddKindToDesks < ActiveRecord::Migration[6.0]
  def change
    add_column :desks, :kind, :integer, default: 1
  end
end
