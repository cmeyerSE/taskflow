# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
Task.create!(
  [
    {
      title: "Build TaskFlow dashboard",
      description: "Create the first dashboard layout in React",
      status: "todo",
      priority: "high",
      due_date: Date.today + 3.days,
      user_id: 1
    },
    {
      title: "Connect Rails API to frontend",
      description: "Fetch tasks from the backend and render them",
      status: "in_progress",
      priority: "medium",
      due_date: Date.today + 5.days,
      user_id: 1
    },
    {
      title: "Add task creation form",
      description: "Allow users to create new tasks",
      status: "todo",
      priority: "low",
      due_date: Date.today + 7.days,
      user_id: 1
    }
  ]
)