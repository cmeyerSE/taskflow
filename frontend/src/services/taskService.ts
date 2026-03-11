const API_URL = "http://localhost:3000/api/v1/tasks"

export const fetchTasks = async () => {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error("Failed to fetch tasks")
    }

    return response.json()
};

export const createTask = async (task: {
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date?: string;
    user_id?: number;
}) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });

    if (!response.ok) {
        throw new Error("Failed to create task");
    }

    return response.json();
}