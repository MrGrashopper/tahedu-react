class Api::V1::ReservationsController < ApplicationController
  before_action :authenticate_user!

  def index
  end

  def create
    if authorized?
      date = params['reservation']['date'][0..9]
      desk = Desk.find_by(id: params['reservation']['desk_id'].to_i)
      reservation = Reservation.find_by(date: date, desk_id: desk.id, team_id: current_user.team_id)

      if reservation.nil?
        respond_to do |format|
        begin
            @res = Reservation.create(date: date, desk_id: desk.id, user_id: current_user.id, team_id: current_user.team_id, name: desk.external_id)
            format.json { render json: @res, status: :created}
          end
        rescue StandardError => e
          puts e
          format.json { render json: @res, status: 404}
        end
      end
    else
      handle_unauthorized
    end

  end

  def destroy
    reservation = Reservation.find_by(id: params[:id])
    if reservation
      reservation.destroy
      redirect_to user_path(current_user), notice: '🚀 Storniert!'
    else
      redirect_to user_path(current_user), notice: 'Fehler 3249'
    end
  end

  private

  def authorized?
    # MUSS NOCH VERFEINERT WERDEN
    current_user.present?
  end
end