class Api::V1::JoinTeamsController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update]
  before_action :authenticate_user!
  def create
    if authorized?
      @user = current_user
      team_id = params[:format]
      user_team = UserTeamId.find_by(user_id: @user.id, team_id: team_id)
      begin
        user_team.update(confirmed: true)
        @user.update(team_id: team_id) if @user.team_id.nil?
        redirect_to edit_user_path(@user), notice: '🚀 Team beigetreten'

      rescue
        redirect_to edit_user_path(@user, user_team), notice: 'Etwas ist schief gelaufen'
      end
    else
      handle_unauthorized
    end
  end

  def destroy
    @user = current_user
    team_id = params[:format]
    user_team = UserTeamId.find_by(user_id: @user.id, team_id: team_id)
    begin
      user_team.update(confirmed: nil)
      redirect_to edit_user_path(@user), notice: '🚀 Einladung abgelehnt'
    rescue
      redirect_to edit_user_path(@user), notice: 'Etwas ist schief gelaufen'
    end
  end

  private

  def set_user
    if @user = User.friendly.find_by(user_name: params[:id]).present?
      @user = User.friendly.find_by(user_name: params[:id])
    else
      @user = User.find(params[:id])
    end
  end

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