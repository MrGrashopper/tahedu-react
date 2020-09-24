class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: [:show, :edit, :update, :destroy, :avatar, :userres]
  def index
    if params[:user_res]
      date = params[:user_res][0..9]
      x =  User.where(team_id: current_user.team_id).with_attached_avatar
      y = x.left_joins(:reservations).where(reservations: {date: date }).uniq
      @users = y
      render json: @users.map { |user| user.as_json.merge({ avatar: url_for(user&.avatar) })}
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
    user = User.find_by(id: current_user.id)
    team_id = current_user.team_id
    avatar = params[:avatar].present? ? params[:avatar] : current_user.avatar_url
    join_team = User.find_by(team_id: params[:join_team])&.team_id if params[:join_team].length > 1
    team_id = join_team.present? ? join_team : team_id
    team_id = params[:team_id].to_i == 1 ?  Digest::SHA1.hexdigest([Time.now, rand].join)[0...15] : team_id
    supervisor = params[:supervisor].to_i == 1 ?  true : false

    begin
      user.update(
        avatar_url: avatar,
        team_id: team_id,
        supervisor: supervisor,
        avatar: avatar
      )
      if join_team.present? && User.find_by(team_id: params[:join_team]) && params[:join_team].length > 1
        redirect_to edit_user_path, notice: '🚀 Team beigetreten'
      elsif join_team.nil? && params[:join_team].length > 1
        redirect_to edit_user_path, notice: '😭 Team nicht gefunden'
      else
        redirect_to edit_user_path, notice: '🚀 Gespeichert'
      end
    rescue
      redirect_to edit_user_path, notice: '😭 Etwas ist schief gelaufen'
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
