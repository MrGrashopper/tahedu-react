
class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update]
  before_action :authorized?, only: [:show, :edit, :update]
  REGEX_PATTERN = /^(.+)@(.+)$/

  def index

  end

  def show
    if authorized?
      @reservations = Reservation.where(user_id: current_user.id, team_id: current_user.team_id).order(date: :desc)
      if @reservations.nil?
        redirect_to root_path, notice: 'Keine Buchungen'
      end
    else
      handle_unauthorized
    end
  end

  def new_user_sign_up
    if authorized?
      email = params[:email]
      password = params[:password]
      password_confirmation = params[:password_confirmation]
      if is_email_valid? email
        if password == password_confirmation
          User.create(email: email, password: password)
          redirect_to root_path, notice: '🚀 Check deine E-Mails!'
        else
          redirect_to new_user_registration_path, notice: 'Passwort stimmt nicht überein'
        end
      else
        redirect_to new_user_registration_path, notice: 'E-mail nicht korrekt'
      end
      users = User.all
      users.each do |user|
        x = user.email.split('@')
        user.update(external_id: x[0] + "-" +  Digest::SHA1.hexdigest([Time.now, rand].join)[0...6])
      end
    else
      handle_unauthorized
    end
  end

  def update
    if authorized?
      user = User.find(current_user.id)
    else
      handle_unauthorized
    end
  end

  def edit
    if authorized?
      @users = User.where(team_id: current_user.team_id)
      @company = CompanyAccount.find_by(team_id: current_user.team_id)
      user_team_ids = UserTeamId.where(user_id: current_user.id, confirmed: true)
      @user_team_ids = user_team_ids.map {|team| team.title}
      @selected_team = UserTeamId.find_by(team_id: current_user.team_id)&.title
      @unconfirmed_team_ids =  UserTeamId.where(user_id: current_user.id, confirmed: false)
    else
      handle_unauthorized
    end
  end

  private

  def set_user
    if @user = User.friendly.find_by(external_id: params[:id]).present?
      @user = User.friendly.find_by(external_id: params[:id])
    else
      @user = User.find(params[:id])
    end
  end

  def authorized?
    current_user.present?
  end

  def is_email_valid? email
    email =~REGEX_PATTERN
  end

  def user_params
    params.require(:user).permit(:email_address, :password, :avatar, :supervisor)
  end

  def handle_unauthorized
    unless authorized?
      redirect_to root_path, notice: '😟 Nicht berechtigt'
    end
  end
end
