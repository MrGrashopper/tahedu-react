class Api::V1::ReservationsController < ApplicationController

  def create
    if authorized?
      date = params['reservation']['date'][0..9]
      desk = Desk.find_by(id: params['reservation']['desk_id'].to_i)
      reservation = Reservation.find_by(date: date, desk_id: desk.id)
      if reservation.nil?
        res = Reservation.create(date: date, desk_id: desk.id, user_id: current_user.id)

        render json: res, status: :created
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
end