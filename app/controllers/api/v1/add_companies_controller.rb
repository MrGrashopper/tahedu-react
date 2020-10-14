class Api::V1::AddCompaniesController < ApplicationController
  before_action :authenticate_user!
  before_action :authenticate_user!
  def create
    team_id = params[:team_id].to_i == 1 ?  Digest::SHA1.hexdigest([Time.now, rand].join)[0...15] : team_id
    company = params["team-name"]

    if params[:team_id].to_i == 1 && company.present?
      company_exists = CompanyAccount.find_by(title: company).present?
      if !company_exists
        current_user.update(team_id: team_id)
        CompanyAccount.create(team_id: team_id, title: company)
        UserTeamId.create(user_id: current_user.id, team_id: team_id, title: company, confirmed: true)
        redirect_to edit_user_path(current_user.id), notice: '🚀 Team erstellt'
      else
        redirect_to edit_user_path(current_user.id), notice: '😔 Team existiert bereits'
      end
    else
      redirect_to edit_user_path(current_user.id), notice: '💢 Bitte bestätigen'
    end
  end
end