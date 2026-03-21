import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

type Task  = {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date?: string;
};

type KanbanColumnProps = {
    id: "todo" | "in_progress" | "done";
    title: string;
    tasks: Task[];
    onDeleteTask: (id: number) => void;
    onEditTask: (task: Task) => void;
};

export default function KanbanColumn({
    id,
    title,
    tasks,
    onDeleteTask,
    onEditTask
}: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="rounded-xl bg-gray-100 p-4">
            <div className="mb-4 flex items--center justify-between">
                <h2 className="text-lg font-semibold">{title}</h2>
                <span className="rounded-full bg-white px-3 py-1 text-sm text-gray-600 shadow">
                    {tasks.length}
                </span>
            </div>

            <div ref={setNodeRef} className="min-h-[200px]">
                <SortableContext
                items={tasks.map((task) => tasks.indexOf.toString())}
                strategy={verticalListSortingStrategy}
                >
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDeleteTask={onDeleteTask}
                            onEditTask={onEditTask}
                        />
                    ))}

                    {tasks.length === 0 && (
                        <div className="rounded-lg border border-dashed border-gray-300 bg-white/60 p-6 text-center text-sm text-gray-400">
                            No tasks here yet
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
}