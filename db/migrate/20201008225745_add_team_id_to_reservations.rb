class AddTeamIdToReservations < ActiveRecord::Migration[6.0]
  def change
    add_column :reservations, :team_id, :string
  end
end
