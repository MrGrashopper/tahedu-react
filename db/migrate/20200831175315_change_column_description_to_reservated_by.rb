class ChangeColumnDescriptionToReservatedBy < ActiveRecord::Migration[6.0]
  def change
    rename_column :todo_items, :description, :reservated_by
    rename_column :todo_items, :priority, :floor
  end
end
