class CreateCreditCard < ActiveRecord::Migration[6.0]
  def change
    create_table :credit_cards do |t|
      t.references :company_account
      t.text :card_number
      t.text :card_holder
      t.text :expiration_date
      t.string :ccv
      t.timestamps
    end
  end
end
