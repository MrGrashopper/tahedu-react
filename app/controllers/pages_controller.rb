class PagesController < ApplicationController

    before_action :authenticate_user!, only: [:my_todo_items, :deskcenter]

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
end