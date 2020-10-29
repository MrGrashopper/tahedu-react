class AddTimeSlotToReservations < ActiveRecord::Migration[6.0]
  def change
    add_column :reservations, :time_slots, :text, default: ""
    remove_column :reservations, :starts_at
    remove_column :reservations, :ends_at
  end
end
