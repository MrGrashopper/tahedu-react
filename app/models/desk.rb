class Desk < ApplicationRecord
  has_many :reservations, dependent: :destroy
  belongs_to :company_account
  enum kind: {
      Basic: 1,
      IT: 2,
      Design: 3,
      Meeting: 4,
  }

end
