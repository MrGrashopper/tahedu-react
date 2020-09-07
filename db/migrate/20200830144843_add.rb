class Add < ActiveRecord::Migration[6.0]
  def change
    add_column :todo_items, :priority, :integer
    add_column :todo_items, :progress, :float
  end
end
