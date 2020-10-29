class Api::V1::ReservationsController < ApplicationController
  before_action :authenticate_user!
  SLOTS = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]

  def index
  end

  def create
    if authorized?
      date = params['reservation']['date'][0..9]
      desk = Desk.find_by(id: params['reservation']['desk_id'].to_i)
      slots =  params['reservation']['slots']
      reservation = Reservation.find_by(user_id: current_user.id, desk_id: desk.id, date: date)

      if slots.length >= 1
        time_slots = SLOTS - slots
      else
        time_slots = SLOTS
      end

      begin
        if reservation.nil?
          @res = Reservation.create(
              date: date,
              desk_id: desk.id,
              user_id: current_user.id,
              team_id: current_user.team_id,
              name: desk.external_id,
              time_slots: time_slots,
              reservated_slots: slots)
        else
          new_slots = []
          old_slots = JSON.parse(reservation.reservated_slots)
          new_slots << old_slots
          new_slots << slots
          arr = new_slots.reduce([], :concat).uniq

          @res = reservation.update(
              date: date,
              desk_id: desk.id,
              user_id: current_user.id,
              team_id: current_user.team_id,
              name: desk.external_id,
              time_slots: time_slots,
              reservated_slots: arr
          )
        end
      rescue StandardError => e
        puts e
        render json: @res, status: 404
      end

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

  def destroy
    if authorized?
      reservation = Reservation.find_by(id: params[:id])
      if reservation
        reservation.destroy
        redirect_to user_path(current_user), notice: '🚀 Storniert!'
      else
        redirect_to user_path(current_user), notice: 'Fehler 3249'
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