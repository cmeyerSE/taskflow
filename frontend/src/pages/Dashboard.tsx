import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core/dist/types";
import TaskForm from "../components/TaskForm";
import KanbanColumn from "../components/KanbanColumn";
import TaskCard from "../components/TaskCard";
import EditTaskModal from "../components/EditTaskModal";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from "../services/taskService";
import { useAuth } from "../context/AuthContext";

type TaskStatus = "todo" | "in_progress" | "done";

const normalizeStatus = (status: string | null | undefined): TaskStatus => {
  const value = (status || "").trim().toLowerCase();

  if (value === "todo" || value === "to do" || value === "to_do") return "todo";
  if (value === "in_progress" || value === "in progress") return "in_progress";
  if (value === "done" || value === "completed" || value === "complete") return "done";

  return "todo";
};


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
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();

  // Define sensors for DndContext
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await fetchTasks();
      const normalizedTasks = data.map((task: Task) => ({
      ...task,
      status: normalizeStatus(task.status),
    }));
      setTasks(normalizedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date?: string;
  }) => {
    try {
      await createTask(taskData);
      await loadTasks();
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to create task.");
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task.");
    }
  };

  const handleOpenEditModal = (task: Task) => {
  setEditingTask(task);
  setIsEditModalOpen(true);
};

const handleCloseEditModal = () => {
  setEditingTask(null);
  setIsEditModalOpen(false);
};

const handleSaveTask = async (
  id: number,
  updatedTaskData: {
    title: string;
    description: string;
    priority: string;
    due_date?: string;
  }
) => {
  try {
    const updatedTask = await updateTask(id, updatedTaskData);

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  } catch (error) {
    console.error("Error saving task:", error);
    setError("Failed to save tasks.");
  }
};

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const normalizedPriority = (task.priority || "").toLowerCase();
      const matchesPriority =
        priorityFilter === "all" || normalizedPriority === priorityFilter;

      if (!matchesPriority) return false;
      if (!query) return true;

      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.status.toLowerCase().includes(query) ||
        normalizedPriority.includes(query)
      );
    });
  }, [tasks, searchQuery, priorityFilter]);

  const todoTasks = useMemo(
    () => filteredTasks.filter((task) => task.status === "todo"),
    [filteredTasks]
  );
  const inProgressTasks = useMemo(
    () => filteredTasks.filter((task) => task.status === "in_progress"),
    [filteredTasks]
  );
  const doneTasks = useMemo(
    () => filteredTasks.filter((task) => task.status === "done"),
    [filteredTasks]
  );

  const findTaskById = (id: string) =>
    tasks.find((task) => task.id.toString() === id);

  const activeTask = activeTaskId ? findTaskById(activeTaskId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(String(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null);

    if (!over) return;
    
    const activeTask = findTaskById(active.id.toString());
    if (!activeTask) return;

    const overId =  over.id.toString();

    let newStatus: TaskStatus | null = null;

    if  (overId === "todo" || overId === "in_progress" || overId === "done") {
      newStatus = overId as TaskStatus;
    } else {
      const overTask = findTaskById(overId);
      if (overTask) {
        newStatus = overTask.status as TaskStatus;
      }
    }

    if (!newStatus || activeTask.status === newStatus) return;

    const previousTask = [...tasks];

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === activeTask.id ? { ...task, status: newStatus as TaskStatus } : task
      )
    );

    try {
      const updatedTask = await updateTask(activeTask.id, { status: newStatus })
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id  === activeTask.id ? { ...task, ...updatedTask } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      setTasks(previousTask);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
      setError("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-white p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            TaskFlow Dashboard
          </h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Log Out
        </button>
      </div>

      <TaskForm onCreateTask={handleCreateTask} />

      <div className="mb-6 grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-[1fr_200px_auto]">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by title, description, status, or priority"
          className="rounded border p-3"
        />

        <select
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(event.target.value as "all" | "low" | "medium" | "high")
          }
          className="rounded border p-3"
        >
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            setPriorityFilter("all");
          }}
          className="rounded border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear filters
        </button>

        <p className="text-sm text-gray-500 md:col-span-3">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </p>
      </div>
      
      {isLoading && (
        <div className="mt-6 text-gray-500">Loading tasks...</div>
      )}

      {error && (
        <div className="mt-6 text-red-500">{error}</div>
      )} {(
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          >
            <div className="grid  gap-6 lg:grid-cols-3">
              <KanbanColumn
                id="todo"
                title="To Do"
                tasks={todoTasks}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleOpenEditModal}
              />

              <KanbanColumn
                id="in_progress"
                title="In Progress"
                tasks={inProgressTasks}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleOpenEditModal}
              />

              <KanbanColumn
                id="done"
                title="Done"
                tasks={doneTasks}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleOpenEditModal}
              />
            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="w-[320px]">
                  <TaskCard
                    task={activeTask}
                    onDeleteTask={handleDeleteTask}
                    onEditTask={handleOpenEditModal}
                    isOverlay
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        <EditTaskModal
          task={editingTask}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveTask}
        />
    </div>
  );
}
