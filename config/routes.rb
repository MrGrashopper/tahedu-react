Rails.application.routes.draw do
  resources :desks

  devise_for :users
  
  authenticated :user do
    root "pages#my_todo_items", as: :authenticated_root
  end
  root "pages#home"

  namespace :api, defaults: { format: :json } do 
    namespace :v1 do
      resources :users, only: [:index, :show, :create, :update, :destroy]
      resources :todo_items, only: [:index, :show, :create, :update, :destroy]
      resources :desks, only: [:index, :show, :create, :update, :destroy, :search]
    end
  end

  resources :users do
    get :index, on: :collection
    get :show, on: :member
  end
end
