const API_URL = "http://localhost:3000/api/v1/tasks"

export const fetchTasks = async () => {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error("Failed to fetch tasks")
    }

    return response.json()
}