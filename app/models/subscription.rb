class Subscription < ApplicationRecord
  belongs_to :company_account, optional: true
end