Rails.application.routes.draw do
  devise_for :users,
    defaults: { format: :json },
    controllers: {
      sessions: "users/sessions",
      registrations: "users/registrations"
    }

  namespace :api do
    namespace :v1 do
      get :csrf_token, to: "csrf#show"
      get :current_user, to: "current_user#show"
      resources :tasks, only: [:index, :create, :update, :destroy]
    end
  end
end
