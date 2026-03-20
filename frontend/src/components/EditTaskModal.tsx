import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: string;
  due_date?: string;
};

type EditTaskModalProps = {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, updatedTask: {
    title: string;
    description: string;
    priority: string;
    due_date?: string;
  }) => Promise<void>;
};

export default function EditTaskModal({
  task,
  isOpen,
  onClose,
  onSave,
}: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setDueDate(task.due_date || "");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await onSave(task.id, {
        title,
        description,
        priority,
        due_date: dueDate || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit Task</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Task title"
              className="rounded border border-gray-300 p-3"
              required
            />

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Task description"
              rows={4}
              className="rounded border border-gray-300 p-3"
            />

            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="rounded border border-gray-300 p-3"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="rounded border border-gray-300 p-3"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}