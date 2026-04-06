class Users::RegistrationsController < Devise::RegistrationsController
    respond_to :json

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
end
