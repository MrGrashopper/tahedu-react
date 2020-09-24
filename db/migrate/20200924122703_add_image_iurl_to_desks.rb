class AddImageIurlToDesks < ActiveRecord::Migration[6.0]
  def change
    add_column :desks, :image_url, :string, default: "../../../assets/images/Basic.png"
  end
end
