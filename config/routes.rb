Rails.application.routes.draw do
  resources :desks, only: [:index, :show, :create, :update, :destroy, :search, :freedesks]
  get "/pages/deskcenter", as: 'deskcenter'


  devise_for :users
  
  authenticated :user do
    root "desks#index", as: :authenticated_root
  end
  root "pages#home"

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :users, only: [:index, :show, :create, :update, :destroy] do
        get :avatar, on: :member
      end
      resources :todo_items, only: [:index, :show, :create, :update, :destroy]
      resources :desks, only: [:index, :show, :create, :update, :destroy, :search, :freedesks]
      resources :reservations, only: [:index, :create, :update, :destroy]
      resource :supervisors, only: [:index, :create, :update, :destroy]
      resource :add_users, only: [:index, :create, :update, :destroy]
      resource :join_teams, only: [:index, :create, :update, :destroy]
    end
  end

  get 'api/v1/userres'

  resources :users do
    get :index, on: :collection
    get :show, on: :member
    get :edit, on: :member
    post :edit, on: :member
  end
end
