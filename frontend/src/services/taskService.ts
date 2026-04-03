const API_URL = "http://localhost:3000/api/v1/tasks"

export const fetchTasks = async () => {
    const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
        },
    });

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
}) => {
    const response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ task }),
    });

    if (!response.ok) {
        throw new Error("Failed to create task");
    }

    return response.json();
}

export const updateTask = async (
    id: number,
    task: {
        title?: string;
        description?: string;
        status?: string;
        priority?: string;
        due_date?: string;
    }
) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ task }),
    });

    if (!response.ok) {
        throw new Error("Failed to update task");
    }

    return response.json()
};

export const deleteTask = async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete task");
    }
};