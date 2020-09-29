class CreateUserTeamIds < ActiveRecord::Migration[6.0]
  def change
    create_table :user_team_ids do |t|
      t.references :user
      t.string :team_id
      t.string :title
      t.timestamps
    end
  end
end
