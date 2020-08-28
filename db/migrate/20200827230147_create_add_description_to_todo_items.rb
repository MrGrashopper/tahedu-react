class CreateAddDescriptionToTodoItems < ActiveRecord::Migration[6.0]
  def change
    create_table :add_description_to_todo_items do |t|

      t.timestamps
    end
  end
end
