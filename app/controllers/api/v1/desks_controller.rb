class Api::V1::DesksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_desk, only: [:show, :edit, :update, :destroy]
  def index
    @desks = Desk.all
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

  def update
  end
  def destroy
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
