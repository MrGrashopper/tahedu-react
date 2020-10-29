class AddReservatedSlotsToReservations < ActiveRecord::Migration[6.0]
  def change
    add_column :reservations, :reservated_slots, :text
  end
end
