class RemoveSomeTables < ActiveRecord::Migration[6.0]
  def change
    drop_table :supervisors
    drop_table :company_accounts
    drop_table :user_team_ids
  end
end
