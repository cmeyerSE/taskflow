Rails.application.routes.draw do
  devise_for :users,
    defaults: { format: :json },
    controllers: {
      sessions: "users/sessions",
      registrations: "users/registrations"
    }

  namespace :api do
    namespace :v1 do
      resources :tasks, only: [:index, :create, :update, :destroy]
      
      resource :current_user, only: [:show]
    end
  end
end
