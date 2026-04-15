class Users::RegistrationsController < Devise::RegistrationsController
    respond_to :json
    skip_before_action :verify_authenticity_token, only: :create

    def create
        build_resource(sign_up_params)

        resource.save
        yield resource if block_given?

        if resource.persisted?
            sign_in(resource)
            render json: {
                status: { code: 200, message: "Signed up successfully." },
                user: {
                    id: resource.id,
                    email: resource.email,
                }
            }, status: :ok
        else
            render json: {
                status: { code: 422, message: "User couldn't be created." },
                errors: resource.errors.full_messages
            }, status: :unprocessable_entity
        end
    end

    private

    def respond_with(resource, _opts = {})
        if resource.persisted?
            render json: {
                status: { code: 200, message: "Signed up successfully." },
                user: {
                    id: resource.id,
                    email: resource.email,
                }
            }, status: :ok
        else
            render json: {
                status: { code: 422, message: "User couldn't be created." },
                errors: resource.errors.full_messages
            }, status: :unprocessable_entity
        end
    end

    protected

    def sign_up_params
        params.require(:user).permit(:email, :password, :password_confirmation)
    end
end
