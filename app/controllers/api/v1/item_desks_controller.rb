class Api::V1::ItemDesksController < ApplicationController
  before_action :authenticate_user!

  def show
    desks = Desk.where(team_id: current_user.team_id).order(id: :asc)
    item_params = params[:items].present? ? params[:items] : nil
    date_params = params[:date].present? ? params[:date] : nil

    if item_params
      items = []
      external_ids = []
      searched_desks = []
      item_params.each {|item| items << JSON.parse(item)}
      items.each{|item| external_ids << item["value"]}.compact
      external_ids.each{|id| desks.each{ |desk| searched_desks << desk if desk.external_id == id}}
      @desks = searched_desks.uniq
      render json: @desks
    else
      date = DateTime.now.strftime("%Y-%m-%d")
      res_desks = desks.includes(:reservations)
      res_arr = []
      res_desks.select {|desk| desk.reservations.map {|res| res_arr << desk if res.date == date}}
      @desks = desks - res_arr.uniq
      render json: @desks
    end
  end
end