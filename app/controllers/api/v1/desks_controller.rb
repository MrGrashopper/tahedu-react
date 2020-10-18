class Api::V1::DesksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_desk, only: [:show, :edit, :update, :destroy]
  def index
    # date
    # filter
    # items
    # index

    date_params = params[:date].present? ? params[:date] : nil
    item_params = params[:items].present? ? params[:items] : nil
    desks = Desk.where(team_id: current_user.team_id).order(id: :asc)

    if date_params
       date = date_params[0..9]
       res_desks = desks.includes(:reservations)
       res_arr = []
       res_desks.select {|desk| desk.reservations.map {|res| res_arr << desk if res.date == date}}
       @desks = desks - res_arr.uniq
       render json: @desks
    else
       date = DateTime.now.strftime("%Y-%m-%d")
       res_desks = desks.includes(:reservations)
       res_arr = []
       res_desks.select {|desk| desk.reservations.map {|res| res_arr << desk if res.date == date}}
       @desks = desks - res_arr.uniq
       render json: @desks
    end

    if item_params
      items = []
      external_ids = []
      searched_desks = []
      item_params.each {|item| items << JSON.parse(item)}
      items.each{|item| external_ids << item["value"]}.compact
      external_ids.each{|id| desks.each{ |desk| searched_desks << desk if desk.external_id == id}}
      @desks = searched_desks.uniq
      render json: @desks
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
    desks = Desk.where(team_id: current_user.team_id)
    desk = desks.find_by(external_id: params[:external_id])
    if desk.present?
      redirect_to deskcenter_path, alert: 'Platznummer schon vorhanden'
    else
      Desk.create(
          external_id: params[:external_id],
          kind: params[:kind].to_i,
          team_id: current_user.team_id,
          enough_distance: params[:external_id],
          notes: params[:notes])

      redirect_to deskcenter_path, notice: 'Platznummer erstellt'
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
