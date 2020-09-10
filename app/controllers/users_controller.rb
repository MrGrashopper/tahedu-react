class UsersController < ApplicationController

  def index

  end

  def show

  end

  def update
    user = User.find(current_user.id)
    t=3

  end

  def edit
    @user = User.find(params[:id])
    t=3
  end

  private

  def user_params
    params.require(:user).permit(:email_address, :password, :avatar)
  end
end
