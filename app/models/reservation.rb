class Reservation < ApplicationRecord
  belongs_to :desk
  searchkick

  after_commit :reindex_product

  def reindex_product
    Reservation&.reindex
  end
end
