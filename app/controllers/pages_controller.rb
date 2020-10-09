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
      @reservations = Reservation.where(user_id: current_user.id, team_id: current_user.team_id).order(date: :desc)
      if @reservations.nil?
          redirect_to root_path, notice: 'Keine Reservierungen'
      end
      t=3
  end
end