module Api
    module V1
        class TasksController < BaseController
            before_action :set_task, only: [:update, :destroy]

            def index
                tasks = current_user.tasks.order(created_at: :desc)
                render json: tasks
            end

            def create
                task = current_user.tasks.new(task_params)

                if task.save
                    render json: task, status: :created
                else
                    render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
                end
            end

            def update
                if @task.update(task_params)
                    render json: @task
                else
                    render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
                end
            end

            def destroy
                @task.destroy
                head :no_content
            end

            private

            def set_task
                @task = current_user.tasks.find_by(id: params[:id])
                return if @task

                render json: { error: "Task not found" }, status: :not_found
            end

            def task_params
                params.require(:task).permit(:title, :description, :status, :priority, :due_date)
            end
        end
    end
end

