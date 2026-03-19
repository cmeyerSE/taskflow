import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Task = {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date?: string;
};

type TaskCardProps = {
    task: Task;
    onDeleteTask: (id: number) => void;
    isOverlay?: boolean;
};

export default function TaskCard({
    task,
    onDeleteTask,
    isOverlay = false
  }: TaskCardProps) {
    const sortable = useSortable({
        id: task.id.toString(),
        disabled: isOverlay
    })

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = 
        sortable;

    const style = isOverlay
    ? undefined
    :{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
    };

    const formattedStatus = task.status.replace(/_/g, " ");

    return (
        <div
            ref={isOverlay ? undefined : setNodeRef}
            style={style}
            {...(!isOverlay ? attributes : {})}
            {...(!isOverlay ? listeners : {})}
            className={`mb-4 cursor-grab rounded-lg bg-white p-5 shadow transition hover:shadow-lg ${
                isOverlay ? "rotate-1 shadow-2x1" : "cursor-grab active:cursor-grabbing"
            }`}
        >
            <h3 className="mb-2 text-lg font-semibold">{task.title}</h3>

            <p className="mb-4 text-gray-600">{task.description}</p>

            <div className="mb-3 flex items-center gap-2 text-sm">
                <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                        task.status === "todo"
                        ? "bg-gray-200 text-gray-700"
                        : task.status === "In Progress"
                        ? "bg-yellow-100  text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                >
                    {task.status.replaceAll("_", " ")}
                </span>
                    <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                        task.priority === "high"
                        ? "bg-red-100  text-red-700"
                        :  task.priority === "medium"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                }`}
                >
                    {task.priority}
                </span>
            </div>
                
            {task.due_date && (
                <p className="mb--4  text-sm text-gray-500">Due: {task.due_date}</p>
            )}

            <button
                onClick={() => onDeleteTask(task.id)}
                className="mt-2 rounded bg-red-500  px-4 py-2  text-sm font-medium text-white hover:bg-red-600"
                >
                    Delete
                </button>
        </div>
    );
}