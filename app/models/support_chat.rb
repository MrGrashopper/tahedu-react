class SupportChat < ApplicationRecord
  belongs_to :user, optional: true

  enum kind: {
      admin: 0,
      user: 1
  }
end
