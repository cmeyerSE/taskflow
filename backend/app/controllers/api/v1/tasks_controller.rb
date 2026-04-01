class Api::V1::TasksController < ApplicationController

    before_action :authenticate_user!
    before_action :set_task, only: [:update, :destroy]

    def index
        render json: current_user.tasks.order(created_at: :desc)
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
            render json: { errors: @task.errors.full_messages }, status: :unprocessalble_entity
        end
    end

    def destroy
        @task.destroy
        head :no_content
    end

    private

    def set_task
        @task = current_user.tasks.find_by(id: params[:id])
    end

    def task_params
        params.require(:task).permit(:title, :description, :status, :priority, :due_date)
    end
end

