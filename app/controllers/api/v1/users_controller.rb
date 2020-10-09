class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user!, only: [:show, :edit, :update, :destroy, :avatar, :userres]
  before_action :set_user, only: [:show, :edit, :update, :destroy, :avatar, :userres]

  def index
    if params[:user_res]
      date = params[:user_res][0..9]
      team = UserTeamId.where(team_id: current_user.team_id)
      team_ids = []
      team.each{|member| team_ids << member.user_id}
      users = User.where(id: team_ids)&.with_attached_avatar
      y = users.left_joins(:reservations).where(reservations: {date: date }).uniq
      @users = y
      render json: @users.map { |user| user.as_json.merge({ avatar: url_for(user.avatar)}) }

    else
      team = UserTeamId.where(team_id: current_user.team_id)
      team_ids = []
      team.each{|member| team_ids << member.user_id}
      users = User.where(id: team_ids)&.with_attached_avatar
      x = users.map { |user| user.as_json.merge({ avatar: url_for(user.avatar),  supervisor: Supervisor.find_by(user_id: user['id'], team_id: current_user.team_id).nil? ? false : true }) }
      @users = x
      render json: @users
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

  end

  def update
    user = User.find_by(id: current_user.id)
    team_id = current_user.team_id
    avatar = params[:avatar]
    supervisor = params[:supervisor].to_i == 1 ?  true : false
    current_company = CompanyAccount.find_by(team_id: current_user.team_id)

    begin
      if supervisor
        sv = Supervisor.find_by(user_id: current_user.id, team_id: team_id)
        if sv
          sv.update(user_id: current_user.id, team_id: team_id, email: current_user.email)
        else
          Supervisor.create(user_id: current_user.id, team_id: team_id, email: current_user.email)
        end
      end

      if params['switch-team'] && params['switch-team'] != current_company.title
        team_id = CompanyAccount.find_by(title: params['switch-team']).team_id
        current_user.update(team_id: team_id)
      end
      user.update(team_id: team_id)
      user.update(avatar: avatar) if avatar
      redirect_to edit_user_path(current_user.id), notice: '🚀 Gespeichert'
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

  def is_supervisor?
    Supervisor.find_by(user_id: current_user.id).present?
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
