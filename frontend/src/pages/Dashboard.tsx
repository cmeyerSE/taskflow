import { useEffect, useState } from "react"
import { fetchTasks } from "../services/taskService"

type Task = {
    id: number
    title: string
    description: string
    status: string
    priority: string
    dueDate: string
}

export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [error, setError] = useState("")

    useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks()
        console.log("Fetched tasks:", data)
        setTasks(data)
      } catch (err) {
        console.error(err)
        setError("Failed to load tasks")
      }
    }

    loadTasks()
  }, [])

  return (
    <div style={{ padding: "2rem" }}>
      <h1>TaskFlow Dashboard</h1>

      {error && <p>{error}</p>}

      {tasks.length === 0 && !error && <p>No tasks found.</p>}

      {tasks.map((task) => (
        <div key={task.id} style={{ marginBottom: "1rem" }}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <small>
            {task.status} • {task.priority}
          </small>
        </div>
      ))}
    </div>
  )
}
