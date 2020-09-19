class PagesController < ApplicationController

    before_action :authenticate_user!, only: [:my_todo_items, :deskcenter]

    def home
    end
    
    def my_todo_items
    end

    def deskcenter
        @kinds = Desk.kinds
        @desks = Desk.where(team_id: current_user.team_id)
    end
end