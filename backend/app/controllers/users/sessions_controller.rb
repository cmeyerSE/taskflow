class Users::SessionsController < Devise::SessionsController
    skip_before_action :verify_authenticity_token, only: [:create, :destroy]
    skip_before_action :verify_signed_out_user, only: :destroy
    wrap_parameters false

    def create
        user = User.find_by(email: params.dig(:user, :email))
        
        if user&.valid_password?(params.dig(:user, :password))
            # Devise sign_in
            sign_in(user)
            
            # Explicitly set session data to ensure persistence
            request.session[:user_id] = user.id
            request.session[:devise_user_id] = user.id
            request.session.options[:expires_after] = 30.minutes
            
            Rails.logger.info("Session created: user=#{user.email}, session_id=#{request.session.id}, cookies=#{request.cookie_jar.to_h}")
            
            render json: {
                status: { code: 200, message: "Logged in successfully." },
                user: { id: user.id, email: user.email }
            }, status: :ok
        else
            render json: {
                status: { code: 401, message: "Invalid credentials" },
                errors: ["Invalid email or password"]
            }, status: :unauthorized
        end
    end

    def destroy
        sign_out(current_user)
        
        render json: {
            status: { code: 200, message: "Logged out successfully." }
        }, status: :ok
    end
end
