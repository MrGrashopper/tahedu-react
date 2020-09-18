class Api::V1::ReservationsController < ApplicationController

  def index
  end

  def create
    if authorized?
      date = params['reservation']['date'][0..9]
      desk = Desk.find_by(id: params['reservation']['desk_id'].to_i)
      reservation = Reservation.find_by(date: date, desk_id: desk.id)

      if reservation.nil?
        respond_to do |format|
        begin
            @res = Reservation.create(date: date, desk_id: desk.id, user_id: current_user.id)
            format.json { render json: @res, status: :created}
          end
        rescue
          format.json { render json: @res, status: 404}
        end
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