class Api::V1::SupportChatsController < ApplicationController
  before_action :authenticate_user!

  def index
    if authorized?
      if current_user.admin?
        if SupportChat.where(user_id: params[:user_id]).present?
          chats = SupportChat.where(user_id: params[:user_id]).order(created_at: :asc)
        else
          user = User.find_by(id: params[:user_id])
          chats = [user_id: user.id, message: "Noch keine Unterhaltung gestartet", kind: 0, id: 0]
        end
      else
        chats = SupportChat.where(user_id: current_user.id).order(created_at: :asc)
      end
      render json: chats
    else
      handle_unauthorized
      render json: 404
    end
  end

  def create
    if authorized?
      message = params[:message]
      kind = current_user.admin? ? 0 : 1

      if current_user.admin?
        user = User.find_by(id: params[:id])
        SupportChat.create(user_id: user.id, message: message, kind: kind) if user
        ActionCable.server.broadcast "room_channel_#{user.id}", message: message, kind: kind
      else
        SupportChat.create(user_id: current_user.id, message: message, kind: kind)
        ActionCable.server.broadcast "room_channel_#{current_user.id}", message: message, kind: kind
      end
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