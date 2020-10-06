class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable, :confirmable

  belongs_to :supervisor, optional: true
  has_many :supervisor
  has_many :user_team_ids
  belongs_to :company_account, optional: true
  has_many :todo_items, dependent: :destroy
  has_many :skills, dependent: :destroy
  has_many :reservations, dependent: :destroy
  has_one_attached :avatar
  after_commit :add_default_avatar, on: [:create, :update]


  private

  def add_default_avatar
    unless avatar.attached?
      self.avatar.attach(io: File.open(Rails.root.join("app", "assets", "images", "img_avatar.png")), filename: 'img_avatar.png' , content_type: "image/png")
    end
  end
end
