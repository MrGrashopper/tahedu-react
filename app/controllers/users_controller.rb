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
    @supervisors = @users.where(supervisor: true)
    t=3
  end

  private

  def user_params
    params.require(:user).permit(:email_address, :password, :avatar, :supervisor)
  end
end
