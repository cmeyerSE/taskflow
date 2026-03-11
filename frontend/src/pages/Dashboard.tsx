import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from "../services/taskService";

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date?: string;
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
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
    try {
      const newTask = await createTask(taskData);
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleStatusChange = async (
    id: number,
    newStatus: "todo" | "in_progress" | "done"
  ) => {
    try {
      const updatedTask = await updateTask(id, { status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-6xl bg-gray-100 p-10">
      <h1 className="mb-8 text-3xl font-bold">TaskFlow Dashboard</h1>

      <TaskForm onCreateTask={handleCreateTask} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col justify-between rounded-lg bg-white p-6 shadow transition hover:shadow-lg"
          >
            <div>
              <h3 className="mb-2 text-lg font-semibold">{task.title}</h3>

              <p className="mb-4 text-gray-600">{task.description}</p>

              <div className="mb-3 flex items-center gap-2 text-sm">
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    task.status === "todo"
                      ? "bg-gray-200 text-gray-700"
                      : task.status === "in_progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {task.status.replaceAll("_", " ")}
                </span>

                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : task.priority === "medium"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              {task.due_date && (
                <p className="mb-4 text-sm text-gray-500">Due: {task.due_date}</p>
              )}
            </div>

            <div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Update Status
                </label>

                <select
                  value={task.status}
                  onChange={(e) =>
                    handleStatusChange(
                      task.id,
                      e.target.value as "todo" | "in_progress" | "done"
                    )
                  }
                  className="w-full rounded border border-gray-300 p-2"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <button
                onClick={() => handleDeleteTask(task.id)}
                className="mt-3 rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}