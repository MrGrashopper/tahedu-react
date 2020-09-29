class UsersController < ApplicationController

  def index

  end

  def show

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
    @unconfirmed_team_ids =  UserTeamId.where(user_id: current_user.id, confirmed: false)
  end

  private

  def user_params
    params.require(:user).permit(:email_address, :password, :avatar, :supervisor)
  end
end
