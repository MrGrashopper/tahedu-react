class ChangeDateReservation < ActiveRecord::Migration[6.0]
  def change
    remove_column :reservations, :day
    remove_column :reservations, :month
    rename_column :reservations, :year, :date
  end
end
