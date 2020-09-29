class AddConfirmedToUserTeamIds < ActiveRecord::Migration[6.0]
  def change
    add_column :user_team_ids, :confirmed, :boolean, default: false
  end
end
