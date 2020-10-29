class Api::V1::ItemDesksController < ApplicationController
  before_action :authenticate_user!
  SLOTS = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]

  def show
    if authorized?
      desks = Desk.where(team_id: current_user.team_id).order(id: :asc)
      item_params = params[:items].present? ? params[:items] : nil
      date = params[:date].present? ? params[:date][0..9] : DateTime.now.strftime("%Y-%m-%d")

      if item_params
        items = []
        external_ids = []
        item_params.each {|item| items << JSON.parse(item)}
        items.each{|item| external_ids << item["value"]}.compact
        res_desks = desks.where(external_id: external_ids).includes(:reservations)
      else
        res_desks = desks.includes(:reservations)
      end

      desks_merged = []
      res_desks.each do |desk|
        desk_json = desk.as_json
        if desk.reservations.where(date: date).first.present?
          d = desk.reservations.where(date: date)
          arr = []
          d.each do |x|
            arr << JSON.parse(x.reservated_slots)
          end
          new_arr = arr.reduce([], :concat).uniq
          desk_json[:slot] = SLOTS - new_arr
        else
          desk_json[:slot] = SLOTS
        end
        desks_merged << desk_json
      end
      new_desks = desks_merged.uniq
      @desks = []
      new_desks.each{|desk| @desks << desk if desk[:slot].length > 2}
      render json: @desks
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