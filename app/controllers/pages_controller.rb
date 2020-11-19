class PagesController < ApplicationController

    before_action :authenticate_user!, only: [:my_todo_items, :deskcenter, :reservations, :dashboard]

    def home
    end

    def my_todo_items
    end

    def deskcenter
        if !current_user.supervisor
            redirect_to root_path, notice: 'Nicht berechtigt'
        else
            @kinds = Desk.kinds
            @desks = Desk.where(team_id: current_user.team_id).order(id: :asc)
        end
    end

    def subscription
        if !current_user.supervisor
            redirect_to root_path, notice: 'Nicht berechtigt'
        else
        end
    end

  def reservations
      if !current_user.supervisor
          redirect_to root_path, notice: 'Nicht berechtigt'
      else
          @user = User.find_by(email: params[:email])
          @reservations = Reservation.where(user_id: @user.id, team_id: current_user.team_id).order(date: :desc)
      end
  end

  def dashboard
      if current_user.team_id.present?

          @reservations = Reservation.where(team_id: current_user.team_id)

          @user_reservations = Reservation.where(team_id: current_user.team_id, user_id: current_user.id)

          users_reservations = Reservation.where(team_id: current_user.team_id).order(created_at: :asc).limit(30)
          users_res_arr = []
          users_reservations.each do |res|
              user = {}
              user[:name] = User.find_by(id: res.user_id).user_name
              user[:count] = Reservation.where(team_id: current_user.team_id, user_id: res.user_id).count
              users_res_arr << user
          end
          @users_reservations = users_res_arr.uniq.collect{|i| [i[:name],i[:count]]}.sort.take(10)


      else
          redirect_to user_path(current_user)
      end
  end
end