class Desk < ApplicationRecord
  has_many :reservations, dependent: :destroy
end
