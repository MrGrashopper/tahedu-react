class Api::V1::FilterDesksController < ApplicationController
  before_action :authenticate_user!

  def show
    date_params = params[:date].present? ? params[:date] : nil
    filter_params = params[:filter].present? ? params[:filter] : nil
    desks = Desk.where(team_id: current_user.team_id).order(id: :asc)

    if filter_params
      date = date_params[0..9]
      res_desks = desks.includes(:reservations)
      res_arr = []
      res_desks.select {|desk| desk.reservations.map {|res| res_arr << desk if res.date == date}}

      if filter_params == "Alle Typen"
        @desks = desks - res_arr.uniq
      else
        @desks = desks.where(kind: filter_params).order(id: :asc) - res_arr.uniq
      end
      render json: @desks
    end
  end

end