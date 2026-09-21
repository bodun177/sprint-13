import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskList from "./TaskList";

describe("TaskList", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  const tasks = [
    { id: 1, text: "Buy milk", completed: false },
    { id: 2, text: "Do laundry", completed: true },
  ];

  it("renders the list of tasks", () => {
    render(<TaskList tasks={tasks} />);
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("Do laundry")).toBeInTheDocument();
  });

  it("renders a message when the task list is empty", () => {
    render(<TaskList />);
    expect(screen.getByText("No tasks to display")).toBeInTheDocument();
  });

  it("stores tasks into local storage", () => {
    render(<TaskList tasks={tasks} />);
    const storedTasksString = localStorage.getItem("tasks");
    expect(storedTasksString).toBeTruthy();
  });

  it("does not render a message when the task list is empty in props, but exists in local storage", () => {
    render(<TaskList tasks={tasks} />);
    cleanup();
    render(<TaskList />);
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("Do laundry")).toBeInTheDocument();
    expect(screen.queryByText("No tasks to display")).not.toBeInTheDocument();
  });

  it.each([
    [
      1,
      [
        { id: 1, text: "Buy milk", completed: false },
        { id: 2, text: "Do laundry", completed: true },
        { id: 3, text: "Task 3", completed: false },
      ],
    ],
    [
      0,
      [
        { id: 1, text: "Task 1", completed: false },
        { id: 2, text: "Task 2", completed: false },
        { id: 3, text: "Task 3", completed: false },
      ],
    ],
  ])(
    "with  given tasks, on click on Remove button with index %p, corresponding task is deleted",
    async (targetIndex, tasks) => {
      render(<TaskList tasks={tasks} />);
      let removeButtons = screen.getAllByText("Remove");

      await userEvent.click(removeButtons[targetIndex]);
      removeButtons = screen.getAllByText("Remove");
      expect(removeButtons).toHaveLength(tasks.length - 1);
      expect(screen.queryByText(tasks[targetIndex].text)).not.toBeInTheDocument();
      tasks
        .filter((_, index) => index !== targetIndex)
        .forEach((task, index) => {
          expect(screen.getByText(task.text)).toBeInTheDocument();
        });
    });

    test("clicking checkbox adds strikethrough style to task text", async () => {
      const tasks = [
        { id: 1, text: "Task 1", completed: false },
        { id: 2, text: "Task 2", completed: false },
      ];
      render(<TaskList tasks={tasks} />);
      const [checkbox1, checkbox2] = await screen.findAllByRole("checkbox");
      let taskElement = screen.getByText("Task 1");
      
      expect(taskElement).not.toHaveStyle("text-decoration: line-through");
      await userEvent.click(checkbox1);
      expect(taskElement).toHaveStyle("text-decoration: line-through");
      
      taskElement = screen.getByText("Task 2");
      expect(taskElement).not.toHaveStyle("text-decoration: line-through");
      await userEvent.click(checkbox2);
      expect(taskElement).toHaveStyle("text-decoration: line-through");
    });
});
