export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onRemove: (id: number) => void;
  onToggle: (id: number) => void;
}

export default function TaskItem({ task, onRemove, onToggle }: TaskItemProps) {
  return (
    <li className="task-item">
      <input
        type="checkbox"
        className="task-item-checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      <span
        className="task-item-text"
        style={{ textDecoration: task.completed ? "line-through" : "none" }}
      >
        {task.text}
      </span>
      <button
        type="button"
        className="task-item-remove-button"
        onClick={() => onRemove(task.id)}
      >
        Remove
      </button>
    </li>
  );
}
