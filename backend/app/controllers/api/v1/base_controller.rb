module Api
  module V1
    class BaseController < ApplicationController
      before_action :require_authenticated_user

      private

      def require_authenticated_user
        return if user_signed_in?

        render json: { error: "Unauthorized" }, status: :unauthorized
      end
    end
  end
end