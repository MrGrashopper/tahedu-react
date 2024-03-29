class Desk < ApplicationRecord
  has_many :reservations, dependent: :destroy

  enum kind: {
      Standard: 1,
      IT: 2,
      Design: 3,
      Meeting: 4,
      Parkplatz: 5,
      Labor: 6
  }

end
