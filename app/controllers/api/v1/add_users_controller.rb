class Api::V1::AddUsersController < ApplicationController
  def create
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
        UserMailer.welcome_email(user, company).deliver_now
        render json: users
      end
    else
      render json: 404
    end
  end
end