class DesksController < ApplicationController
  before_action :set_desk, only: [:show, :edit, :update, :destroy, :deskcenter]

  # GET /desks
  # GET /desks.json
  def index
    if current_user.team_id.nil?
      redirect_to edit_user_path(current_user.id)
    end
    @desks = Desk.all
  end

  # GET /desks/1
  # GET /desks/1.json
  def show
  end

  # GET /desks/new
  def new
    @desk = Desk.new
  end

  # GET /desks/1/edit
  def edit
  end

  def deskcenter
  end

  # POST /desks
  # POST /desks.json
  def create
    @desk = Desk.new(desk_params)

    respond_to do |format|
      if @desk.save
        format.html { redirect_to @desk, notice: 'Desk was successfully created.' }
        format.json { render :show, status: :created, location: @desk }
      else
        format.html { render :new }
        format.json { render json: @desk.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /desks/1
  # PATCH/PUT /desks/1.json
  def update
    respond_to do |format|
      if @desk.update(desk_params)
        format.html { redirect_to @desk, notice: 'Desk was successfully updated.' }
        format.json { render :show, status: :ok, location: @desk }
      else
        format.html { render :edit }
        format.json { render json: @desk.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /desks/1
  # DELETE /desks/1.json
  def destroy
    @desk.destroy
    respond_to do |format|
      format.html { redirect_to deskcenter_path, notice: 'Desk gelöscht' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_desk
      @desk = Desk.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def desk_params
      params.fetch(:desk, {})
    end
end
