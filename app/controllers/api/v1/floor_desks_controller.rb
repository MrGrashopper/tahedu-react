class Api::V1::FloorDesksController < ApplicationController
  before_action :authenticate_user!

  def show
    floor_params = params[:floor].present? ? params[:floor] : nil
    date_params = params[:date].present? ? params[:date] : nil
    desks = Desk.where(team_id: current_user.team_id).order(id: :asc)

    if floor_params
      date = date_params[0..9]
      res_desks = desks.includes(:reservations)
      res_arr = []
      res_desks.select {|desk| desk.reservations.map {|res| res_arr << desk if res.date == date}}
      kind = params[:kind]

      if floor_params == "Alle Etagen"
        if kind != "Alle Typen" && !kind.nil?
          @desks = desks.where(kind: kind) - res_arr.uniq
        else
          @desks = desks.order(id: :asc) - res_arr.uniq
        end
      else
        if kind != "Alle Typen" && !kind.nil?
          @desks = desks.where(floor: floor_params.to_i, kind: kind).order(id: :asc) - res_arr.uniq
        else
          @desks = desks.where(floor: floor_params.to_i).order(id: :asc) - res_arr.uniq
        end
      end
      render json: @desks
    end
  end

end