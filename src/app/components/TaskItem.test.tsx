import { render, fireEvent, screen} from "@testing-library/react";
import TaskItem from "./TaskItem";

describe("TaskItem", () => {
  const task = { id: 1, text: "Buy milk", completed: false };
  const onToggle = jest.fn();
  const onRemove = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it("renders the task text", () => {
    render(<TaskItem task={task} onToggle={onToggle} onRemove={onRemove} />);
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
  });

  it("renders a checkbox that reflects the task's completed status", () => {
    render(<TaskItem task={task} onToggle={onToggle} onRemove={onRemove} />);
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it("invokes the onToggle callback when the checkbox is clicked", () => {
    render(<TaskItem task={task} onToggle={onToggle} onRemove={onRemove} />);
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it("invokes the onRemove callback when the remove button is clicked", () => {
    render(<TaskItem task={task} onToggle={onToggle} onRemove={onRemove} />);
    const removeButton = screen.getByRole("button");
    fireEvent.click(removeButton);
    expect(onRemove).toHaveBeenCalledWith(1);
  });
});
