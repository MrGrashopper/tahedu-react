class Api::V1::DesksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_desk, only: [:show, :edit, :update, :destroy]
  SLOTS = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]

  def index
    if authorized?
      date = params[:date].present? ? params[:date][0..9] : DateTime.now.strftime("%Y-%m-%d")
      desks = Desk.where(team_id: current_user.team_id).order(id: :asc)
      res_desks = desks.includes(:reservations)
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

  def show
    if authorized?
      respond_to do |format|
        format.json { render :show }
      end
    else
      handle_unauthorized
    end
  end

  def create
    if authorized?
      desks = Desk.where(team_id: current_user.team_id)
      desk = desks.find_by(external_id: params[:external_id])

      if desk.present?
        redirect_to deskcenter_path, alert: 'Platznummer schon vorhanden'
      else
        Desk.create(
            external_id: params[:external_id],
            kind: params[:kind].to_i,
            team_id: current_user.team_id,
            enough_distance: params[:enough_distance],
            notes: params[:notes])

        redirect_to deskcenter_path, notice: 'Platznummer erstellt'
      end
    else
      handle_unauthorized
    end
  end

  def update
  end
  def destroy
  end

  def search
    render json: Reservation.search(params[:query], {
        fields: ["title^3"],
        match: :word_start,
        suggest: [:title],
        limit: 10,
        load: false,
        autocomplete: true,
        misspellings: {below: 3}
    }).map(&:title)
  end

  private

  def set_desk
    @desk = Desk.find(params[:id])
  end

  def authorized?
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
