class AddDescriptionToTodoItems < ActiveRecord::Migration[6.0]
  def change
    add_column :todo_items, :description, :text
  end
end
