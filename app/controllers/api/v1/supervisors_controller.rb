class Api::V1::SupervisorsController < ApplicationController
  before_action :authenticate_user!
  def index
  end

  def create
    if authorized?
      user = User.find_by(id: params[:supervisor][:id])
      team_id = current_user.team_id
      if user
        sv = Supervisor.find_by(user_id: user.id, team_id: user.team_id)
        if sv
          sv.update(user_id: user.id, team_id: team_id, email: user.email)
        else
          Supervisor.create(user_id: user.id, team_id: user.team_id, email: user.email)
        end
        team = UserTeamId.where(team_id: current_user.team_id)
        team_ids = []
        team.each{|member| team_ids << member.user_id}
        users = User.where(id: team_ids)&.with_attached_avatar
        x = users.map { |user| user.as_json.merge({ avatar: url_for(user.avatar),  supervisor: Supervisor.find_by(user_id: user['id'], team_id: current_user.team_id).nil? ? false : true }) }
        @users = x
        render json: @users
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
      sv = Supervisor.find_by(user_id: user.id, team_id: current_user.team_id)
      if user && sv
        sv.delete
        team = UserTeamId.where(team_id: current_user.team_id)
        team_ids = []
        team.each{|member| team_ids << member.user_id}
        users = User.where(id: team_ids)&.with_attached_avatar
        x = users.map { |user| user.as_json.merge({ avatar: url_for(user.avatar),  supervisor: Supervisor.find_by(user_id: user['id'], team_id: current_user.team_id).nil? ? false : true }) }
        @users = x
        render json: @users
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