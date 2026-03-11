import { useEffect, useState } from "react"
import TaskForm from "../components/TaskForm";
import { createTask, fetchTasks } from "../services/taskService"

type Task = {
  id: number
  title: string
  description: string
  status: string
  priority: string
  due_date?: string
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const data = await fetchTasks()
      setTasks(data)
    } catch (error) {
      console.error("Error loading tasks:", error)
    }
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date?: string;
    user_id?: number;
  }) => {
    const newTask = await createTask(taskData);
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8">TaskFlow Dashboard</h1>

      <TaskForm onCreateTask={handleCreateTask} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">{task.title}</h3>

            <p className="text-gray-600 mb-4">{task.description}</p>

            <div className="flex justify-between text-sm">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                {task.status}
              </span>

              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                {task.priority}
              </span>
            </div>

            {task.due_date && (
              <p className="text-sm text-gray-500">Due: {task.due_date}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}