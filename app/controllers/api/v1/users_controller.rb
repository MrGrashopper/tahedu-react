class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: [:show, :edit, :update, :destroy, :avatar, :userres]
  def index
    if params[:user_res]
      date = params[:user_res][0..9]
      x =  User.where(team_id: current_user.team_id)
      y = x.left_joins(:reservations).where(reservations: {date: date }).uniq
      @users = y
      render :json => @users
    else
      @users = User.where(team_id: current_user.team_id)
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

  def update
    # VERBESSERN!!!!!
    if params[:avatar].present?
      current_user.avatar.attach params[:avatar]
      user = User.find_by(id: current_user.id)
      user.update(avatar_url: url_for(user.avatar))
      redirect_to edit_user_path, notice: 'gespeichert'
    elsif params[:team_id].to_i == 1
      team_id = Digest::SHA1.hexdigest([Time.now, rand].join)
      user = User.find_by(id: current_user.id)
      user.update(team_id: team_id)
      redirect_to edit_user_path, notice: 'gespeichert'
    elsif params[:join_team].present?
      find_team = User.find_by(team_id: params[:join_team])
      if find_team.present?
        user = User.find_by(id: current_user.id)
        user.update(team_id: params[:join_team])
        redirect_to edit_user_path, notice: '🚀 Gespeichert'
      else
        redirect_to edit_user_path, notice: '😭 Team nicht gefunden'
      end
    else
      redirect_to edit_user_path, notice: '🚀 Gespeichert'
    end
  end

  def destroy
  end
  private

  def set_user
    @user = User.find(params[:id])
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
