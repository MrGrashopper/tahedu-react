class DeleteSupervisorFromUsers < ActiveRecord::Migration[6.0]
  def change
    remove_column :users, :supervisor
  end
end
