import { useState } from "react";

type TaskFormProps = {
    onCreateTask: (task: {
        title: string;
        description: string;
        status: string;
        priority: string;
        due_date?: string;
        user_id?: number;
    }) => Promise<void>;
};

export default function TaskForm({ onCreateTask }: TaskFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("todo");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onCreateTask({
                title,
                description,
                status,
                priority,
                due_date: dueDate || undefined,
                user_id: 1,
            });

            setTitle("");
            setDescription("");
            setStatus("todo");
            setPriority("Medium");
            setDueDate("");
        } catch (error) {
            console.error("Error creating task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow p-6 mb-6"
        >
            <h2 className="text-xl font-semibold mb-4">Create New Task</h2>

            <div className="grid gap-4 md:grid-cols-2">
                <input
                    type="text"
                    placeholder="Task title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="rounded border p-3"
                    required
                />

                <input
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    className="rounded border p-3"
                />

                <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="rounded border p-3"
                >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>

                <select
                    value={priority}
                    onChange={(event) => setPriority(event.target.value)}
                    className="rounded border p-3"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <textarea
                placeholder="Task description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-4 rounded border p-3 w-full"
            />

            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
            >   
                {isSubmitting ? "Creating..." : "Create Task"}
            </button>
        </form>
    );
}
