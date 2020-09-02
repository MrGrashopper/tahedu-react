class CreateDesks < ActiveRecord::Migration[6.0]
  def change
    create_table :desks do |t|

      t.timestamps
    end
  end
end
