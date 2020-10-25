class Api::V1::AddUsersController < ApplicationController
  before_action :authenticate_user!

  def create
    if authorized?
      team_id = current_user.team_id
      user = User.find_by(email: params[:add_user])
      users = User.where(team_id: team_id)
      company = CompanyAccount.find_by(team_id: team_id)

      if user
        still_exists = UserTeamId.find_by(user_id: user.id, team_id: team_id)
        if still_exists
          render json: 400
        else
          UserTeamId.create(user_id: user.id, title: company.title, team_id: team_id)

          team = UserTeamId.where(team_id: team_id)
          team_ids = []
          team.each{|member| team_ids << member.user_id}
          users = User.where(id: team_ids)&.with_attached_avatar
          x = users.map { |user| user.as_json.merge({ avatar: url_for(user.avatar),  supervisor: Supervisor.find_by(user_id: user['id'], team_id: current_user.team_id).nil? ? false : true }) }
          @users = x
          render json: @users
          UserMailer.welcome_email(user, company).deliver_now
        end
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