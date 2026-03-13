import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core/dist/types";
import TaskForm from "../components/TaskForm";
import KanbanColumn from "../components/KanbanColumn";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from "../services/taskService";

type TaskStatus = "todo" | "in_progress" | "done";

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

  const todoTasks = useMemo(
    () => tasks.filter((task) => task.status === "todo"),
    [tasks]
  );
  const inProgressTasks = useMemo(
    () => tasks.filter((task) => task.status === "in_progress"),
    [tasks]
  );
  const doneTasks = useMemo(
    () => tasks.filter((task) => task.status === "done"),
    [tasks]
  );

  const findTaskById = (id: string) =>
    tasks.find((task) => task.id.toString() === id);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

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

    const previousStatus = tasks;

    const updatedTasks = tasks.map((task) =>
      task.id === activeTask.id ? { ...task, status: newStatus! } : task
    );
    setTasks(updatedTasks);

    try {
      const updatedTask = await updateTask(activeTask.id, { status: newStatus })
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id  === activeTask.id ? { ...task, ...updatedTask } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      setTasks(previousStatus);
    }
  };

  // Define sensors for DndContext
  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-white p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        TaskFlow Dashboard
      </h1>

      <TaskForm onCreateTask={handleCreateTask} />
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        >
          <div className="grid  gap-6 lg:grid-cols-3">
            <KanbanColumn
              id="todo"
              title="To Do"
              tasks={todoTasks}
              onDeleteTask={handleDeleteTask}
            />

            <KanbanColumn
              id="in_progress"
              title="In Progress"
              tasks={inProgressTasks}
              onDeleteTask={handleDeleteTask}
            />

            <KanbanColumn
              id="done"
              title="Done"
              tasks={doneTasks}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </DndContext>
    </div>
  );
}