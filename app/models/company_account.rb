class CompanyAccount < ApplicationRecord
  has_many :users
  has_many :desks
  has_one :credit_card
end
