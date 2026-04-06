import { getCsrfToken } from "./csrfService";
import { API_BASE_URL } from "./apiConfig";
const API_URL = `${API_BASE_URL}/api/v1/tasks`

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
    const csrfToken = await getCsrfToken();
    const response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-CSRF-Token": csrfToken,
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
    const csrfToken = await getCsrfToken();
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ task }),
    });

    if (!response.ok) {
        throw new Error("Failed to update task");
    }

    return response.json()
};

export const deleteTask = async (id: number) => {
    const csrfToken = await getCsrfToken();
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "X-CSRF-Token": csrfToken,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete task");
    }
};
