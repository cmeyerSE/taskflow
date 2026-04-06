module Api
  module V1
    class CsrfController < ApplicationController
      def show
        render json: { csrfToken: form_authenticity_token }, status: :ok
      end
    end
  end
end
