class UsersController < ApplicationController
  REGEX_PATTERN = /^(.+)@(.+)$/

  def index

  end

  def show

  end

  def new_user_sign_up
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
  end

  def update
    user = User.find(current_user.id)
  end

  def edit
    @user = User.find(params[:id])
    @users = User.where(team_id: current_user.team_id)
    @company = CompanyAccount.find_by(team_id: current_user.team_id)
    user_team_ids = UserTeamId.where(user_id: current_user.id, confirmed: true)
    @user_team_ids = user_team_ids.map {|team| team.title}
    @selected_team = UserTeamId.find_by(team_id: current_user.team_id)&.title
    @unconfirmed_team_ids =  UserTeamId.where(user_id: current_user.id, confirmed: false)
  end

  private

  def is_email_valid? email
    email =~REGEX_PATTERN
  end

  def user_params
    params.require(:user).permit(:email_address, :password, :avatar, :supervisor)
  end
end
