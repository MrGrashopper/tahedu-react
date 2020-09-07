class Api::V1::DesksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_desk, only: [:show, :edit, :update, :destroy]
  def index
    desks = Desk.all

    if params['reservation_date'].present?
      date = params['reservation_date'][0..9]
      desk_arr = []
      desks.each{|desk| desk_arr << desk if desk.reservations.first.nil?}
      desks.each{|desk| desk&.reservations.each{|res| desk_arr << desk if res.date != date}}
      @free_desks = desk_arr
      render :json => @free_desks
    end

    date_params = params[:date].present? ? params[:date] : nil
    @reservations =
        if date_params
           search = date_params[0..9]
           Reservation.where(date: search)
        else
           Reservation.where(date: DateTime.now.strftime("%Y-%m-%d"))
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
    date = params['reservation']['date'][0..9]
    desk = Desk.find_by(id: params['reservation']['desk'].to_i)

    if authorized?
      begin
        reservation = Reservation.find_by(date: date, desk_id: desk.id)
        if reservation.nil?
        Reservation.create(date: date, desk_id: desk.id, user_id: current_user.id)
          render :json => @free_desks
        else
          render :json => @free_desks
        end
      rescue StandardError => e
        p "#{e}"
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
