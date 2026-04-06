module Api
  module V1
    class CurrentUserController < BaseController
      def show
        render json: {
          id: current_user.id,
          email: current_user.email
        }, status: :ok
      end
    end
  end
end