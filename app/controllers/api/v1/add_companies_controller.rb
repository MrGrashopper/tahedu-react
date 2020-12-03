class Api::V1::AddCompaniesController < ApplicationController
  before_action :authenticate_user!

  def create
    if authorized?
      team_id = params[:team_id].to_i == 1 ?  Digest::SHA1.hexdigest([Time.now, rand].join)[0...15] : team_id
      company = params["team-name"]

      if params[:team_id].to_i == 1 && company.present?
        company_exists = CompanyAccount.find_by(title: company).present?
        if !company_exists
          current_user.update(team_id: team_id)
          CompanyAccount.create(team_id: team_id, title: company, main_email: current_user.email)
          UserTeamId.create(user_id: current_user.id, team_id: team_id, title: company, confirmed: true)
          Supervisor.create(user_id: current_user.id, team_id: team_id, email: current_user.email, user_name: current_user.user_name)
          redirect_to subscription_path, notice: '🚀 Team erstellt'
        else
          redirect_to edit_user_path(current_user.id), notice: '😔 Team existiert bereits'
        end
      else
        redirect_to edit_user_path(current_user.id), notice: '💢 Bitte bestätigen'
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