class PagesController < ApplicationController

    before_action :authenticate_user!, only: [:my_todo_items, :deskcenter]

    def home
    end
    
    def my_todo_items
    end

    def deskcenter
    end
end