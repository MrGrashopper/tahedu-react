class Api::V1::InUseDesksController < ApplicationController
  before_action :authenticate_user!

  def show
    if authorized?
      all_desks_params = params[:all_desks].present? ? params[:all_desks] : nil
      if all_desks_params
        desks = Desk.where(team_id: current_user.team_id).order(id: :asc)
        render json: desks
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