class PagesController < ApplicationController

    before_action :authenticate_user!, only: [:my_todo_items, :deskcenter, :reservations]

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

  def reservations
      if !current_user.supervisor
          redirect_to root_path, notice: 'Nicht berechtigt'
      else
          @user = User.find_by(email: params[:email])
          @reservations = Reservation.where(user_id: @user.id, team_id: current_user.team_id).order(date: :desc)
      end
  end
end