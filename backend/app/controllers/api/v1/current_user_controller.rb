module Api
  module V1
    class CurrentUserController < ApplicationController
      def show
        if user_signed_in?
          render json: {
            user: {
              id: current_user.id,
              email: current_user.email
            }
          }, status: :ok
        else
          render json: { user: nil }, status: :ok
        end
      end
    end
  end
end