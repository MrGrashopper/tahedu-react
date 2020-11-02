class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable

  extend FriendlyId
  friendly_id :external_id, use: :slugged

  belongs_to :supervisor, optional: true
  has_many :supervisor
  has_many :user_team_ids
  belongs_to :company_account, optional: true
  has_many :todo_items, dependent: :destroy
  has_many :skills, dependent: :destroy
  has_many :reservations, dependent: :destroy
  has_one_attached :avatar
  has_many :support_chats
  validate :avatar_validation
  after_commit :add_default_avatar, on: [:create, :update]
  after_create :send_confirmation_email, :create_external_id


  private

  def create_external_id
    split = email.split('@')
    email_name = split[0]
    calc_name = []
    arr = email_name.chars
    arr.each {|a| calc_name << a if a != "." }
    ext_name = calc_name.join("")
    external_id = ext_name  + "-" +  Digest::SHA1.hexdigest([Time.now, rand].join)[0...6]
    user = User.find_by(email: email)
    user.update(external_id: external_id)
  end

  def avatar_validation
    if avatar.attached?
      if avatar.blob.byte_size > 800000
        avatar.purge
        errors[:base] << 'Too big'
      elsif !avatar.blob.content_type.starts_with?('image/')
        avatar.purge
        errors[:base] << 'Wrong format'
      end
    end
  end

  def send_confirmation_email
    @user = User.find_by(email: email)
    @user.send_confirmation_instructions
  end

  def add_default_avatar
    unless avatar.attached?
      self.avatar.attach(io: File.open(Rails.root.join("app", "assets", "images", "img_avatar.png")), filename: 'img_avatar.png' , content_type: "image/png")
    end
  end
end
