"use client";

import { FormEvent, useEffect, useState } from "react";
import TaskItem, { Task } from "./TaskItem";

interface TaskListProps {
  tasks?: Task[];
}

const STORAGE_KEY = "tasks";

function loadTasks(): Task[] {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }
  try {
    return JSON.parse(stored) as Task[];
  } catch {
    return [];
  }
}

export default function TaskList({ tasks: initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks ?? []);
  const [text, setText] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    setTasks(initialTasks ?? loadTasks());
    setLoaded(true);
  }, [initialTasks]);

  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

  const handleAddTask = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, completed: false },
    ]);
    setText("");
  };

  const handleRemoveTask = (id: number): void => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleToggleTask = (id: number): void => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="task-list">
      <h1 className="task-list-title">Task List</h1>
      <form className="add-task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          className="add-task-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Add a new task"
        />
        <button type="submit" className="add-task-button">
          Add
        </button>
      </form>
      {tasks.length === 0 ? (
        <p className="task-list-empty">No tasks to display</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onRemove={handleRemoveTask}
              onToggle={handleToggleTask}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
