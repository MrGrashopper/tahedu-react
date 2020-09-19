class AddEnoughDistanceToDesks < ActiveRecord::Migration[6.0]
  def change
    add_column :desks, :enough_distance, :boolean, default: false
    add_column :desks, :notes, :text, default: nil
  end
end
