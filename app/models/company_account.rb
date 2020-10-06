class CompanyAccount < ApplicationRecord
  has_many :users
  has_many :desks
end
