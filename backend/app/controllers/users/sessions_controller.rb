class Users::SessionsController < Devise::SessionsController
    respond_to :json
    skip_before_action :verify_signed_out_user, only: :destroy
    

    private

    def respond_with(resource, _opts = {})
        render json: {
            status: { code: 200, message: "Logged in successfully." },
            user: {
                id: current_user&.id,
                email: current_user&.email,
            }
        }, status: :ok
    end

    def respond_to_on_destroy
        render json: {
            status: { code: 200,
            message: "Logged out successfully." }
        }, status: :ok
    end
end
