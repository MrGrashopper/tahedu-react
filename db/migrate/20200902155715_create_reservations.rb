class CreateReservations < ActiveRecord::Migration[6.0]
  def change
    create_table :reservations do |t|
      t.references :desk, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :year, default: "2020"
      t.string :month, default: "01"
      t.string :day, default: "01"
      t.string :starts_at, default: "09:00"
      t.string :ends_at, default: "18:00"
      t.timestamps
    end
  end
end
