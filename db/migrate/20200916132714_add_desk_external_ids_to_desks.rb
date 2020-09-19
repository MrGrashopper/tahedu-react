class AddDeskExternalIdsToDesks < ActiveRecord::Migration[6.0]
  def change
    add_column :desks, :external_id, :string
  end
end
