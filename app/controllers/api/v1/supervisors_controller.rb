class Api::V1::SupervisorsController < ApplicationController

  def index
  end

  def create
    if authorized?
      user = User.find_by(id: params[:supervisor][:id])
      @users = User.where(team_id: current_user.team_id).with_attached_avatar
      if user
        user.update(supervisor: true)
        render json: @users.map { |user| user.as_json.merge({ avatar: url_for(user&.avatar) })}
      else
        render json: 404
      end
    else
      handle_unauthorized
    end
  end

  def destroy
    if authorized?
      user = User.find_by(id: params[:id])
      @users = User.where(team_id: current_user.team_id).with_attached_avatar
      if user
        user.update(supervisor: false)
        render json: @users.map { |user| user.as_json.merge({ avatar: url_for(user&.avatar) })}
      else
        render json: 404
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