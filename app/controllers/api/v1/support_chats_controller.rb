class Api::V1::SupportChatsController < ApplicationController
  before_action :authenticate_user!

  def index
    if authorized?
      chats = SupportChat.where(user_id: current_user.id).order(created_at: :asc)
      render json: chats
    else
      handle_unauthorized
      render json: 404
    end
  end

  def create
    if authorized?
      user = current_user
      text = params[:text]

    else
      handle_unauthorized
    end
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