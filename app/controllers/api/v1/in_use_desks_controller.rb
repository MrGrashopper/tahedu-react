class Api::V1::InUseDesksController < ApplicationController
  before_action :authenticate_user!

  def show
    all_desks_params = params[:all_desks].present? ? params[:all_desks] : nil
    if all_desks_params
      desks = Desk.where(team_id: current_user.team_id).order(id: :asc)
      render json: desks
    end
  end
end