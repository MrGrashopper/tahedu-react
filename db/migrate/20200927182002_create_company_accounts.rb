class CreateCompanyAccounts < ActiveRecord::Migration[6.0]
  def change
    create_table :company_accounts do |t|
      t.string :title
      t.string :team_id
      t.timestamps
    end
  end
end
