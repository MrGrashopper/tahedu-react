class AddTeamToDesksUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :desks, :team_id, :string
    add_column :users, :team_id, :string
  end
end
