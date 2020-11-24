class AddMainEmailToCompanyAccount < ActiveRecord::Migration[6.0]
  def change
    add_column :company_accounts, :main_email, :string
  end
end
