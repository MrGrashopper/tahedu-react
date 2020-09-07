class AddUserInfosToSkills < ActiveRecord::Migration[6.0]
  def change
    add_column :skills, :email, :string
    add_column :skills, :first_name, :string
    add_column :skills, :last_name, :string
  end
end
