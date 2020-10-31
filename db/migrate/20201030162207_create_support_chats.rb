class CreateSupportChats < ActiveRecord::Migration[6.0]
  def change
    create_table :support_chats do |t|
      t.references :user
      t.text :message
      t.integer :kind, default: 0
      t.timestamps
    end
  end
end
