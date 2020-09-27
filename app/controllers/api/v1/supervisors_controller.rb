class Api::V1::SupervisorsController < ApplicationController

  def index
  end

  def create
    if authorized?
      user = User.find_by(id: params[:supervisor][:id])
      if user
        sv = Supervisor.find_by(user_id: user.id, team_id: user.team_id)
        if sv
          sv.update(user_id: user.id, team_id: team_id, email: user.email)
        else
          Supervisor.create(user_id: user.id, team_id: user.team_id, email: user.email)
        end
        @users = User.where(team_id: user.team_id).with_attached_avatar
        render json: @users.map { |user| user.as_json.merge({ avatar: url_for(user&.avatar), supervisor: user.supervisor })}
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
      sv = Supervisor.find_by(user_id: user.id, team_id: user.team_id)
      if user && sv
        sv.delete
        @users = User.where(team_id: user.team_id).with_attached_avatar
        render json: @users.map { |user| user.as_json.merge({ avatar: url_for(user&.avatar), supervisor: user.supervisor })}
      else
        render json: 404
      end
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