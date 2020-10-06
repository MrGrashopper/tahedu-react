class CreateSupervisors < ActiveRecord::Migration[6.0]
  def change
    create_table :supervisors do |t|
      t.references :user, null: false, foreign_key: true
      t.string :team_id
      t.string :email
      t.timestamps
    end
  end
end
