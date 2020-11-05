class Api::V1::AdminUsersController < ApplicationController
  before_action :authenticate_user!

  def index
    if authorized?
      if current_user.admin?
        users = User.all
      end

      render json: users
    else
      handle_unauthorized
      render json: 404
    end
  end

  def create

  end

  private

  def authorized?
    # MUSS NOCH VERFEINERT WERDEN
    current_user.present?
  end

  def handle_unauthorized
    unless authorized?
      respond_to do |format|
        format.json { render :unauthorized, status: 401 }
      end
    end
  end

end