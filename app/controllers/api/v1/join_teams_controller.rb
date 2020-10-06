class Api::V1::JoinTeamsController < ApplicationController
  before_action :authenticate_user!
  def create
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
end