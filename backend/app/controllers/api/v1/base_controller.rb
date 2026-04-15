module Api
  module V1
    class BaseController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :require_authenticated_user

      private

      def require_authenticated_user
        Rails.logger.info("Checking authentication - user_signed_in?: #{user_signed_in?}, current_user: #{current_user&.email}, session_id: #{request.session.id}")
        return if user_signed_in?

        render json: { error: "Unauthorized" }, status: :unauthorized
      end
    end
  end
end