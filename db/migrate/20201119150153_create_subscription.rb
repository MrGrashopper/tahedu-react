class CreateSubscription < ActiveRecord::Migration[6.0]
  def change
    create_table :subscriptions do |t|
      t.references "company_account"
      t.string "subscribed_by"
      t.float "price"
      t.integer "quantity"
      t.integer "kind"
    end
  end
end
