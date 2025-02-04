"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, CheckCircle } from "lucide-react";
import { addTask, deleteTask, editTask, getTasks, toggleTask } from "./actions";
import { Calendar } from "@/components/ui/calendar"; // ShadCN Date Picker
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { formatDate } from "@/lib/utils";

export interface Task {
  _id: string;
  task: SingleTask;
  completed: boolean;
}

export interface SingleTask {
  title: string;
  description: string;
  dueDate: Date | null;
}

export default function TaskManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskObject, setTaskObject] = useState<SingleTask>({
    title: "",
    description: "",
    dueDate: null,
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // fetching initial tasks
  useEffect(() => {
    async function fetchTasks() {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    }
    fetchTasks();
  }, []);

  // Adding and esiting tasks
  const handleAddTask = async () => {
    try {
      if (Object.keys(taskObject).length === 0) return;
      if (new Date(taskObject.dueDate!).getTime() < Date.now()) {
        toast({
          title: "Error!!",
          description: "Due date is in the past!",
        });
        return;
      }

      setLoading(true);
      if (editingTask) {
        // editing
        await editTask(editingTask._id, taskObject);
        setEditingTask(null);
        setTasks(await getTasks());
        toast({
          title: "Sucess!!",
          description: "Task updated Successfully",
        });
      } else {
        // adding
        await addTask(taskObject);
        setTaskObject({ title: "", description: "", dueDate: null });
        setTasks(await getTasks());
        toast({
          title: "Sucess!!",
          description: "Task added Successfully",
        });
      }
      setLoading(false);
      setTaskObject({ title: "", description: "", dueDate: null });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error!!",
        description: "Error adding or updating Task",
      });
    }
  };

  // Deleting task
  const handleDeleteTask = async (id: string) => {
    try {
      setLoading(true);
      await deleteTask(id);
      setTasks(await getTasks());
      toast({
        title: "Sucess!!",
        description: "Task deleted Successfully",
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error!!",
        description: "Error deleting Task",
      });
    }
  };

  // Marking task as complete
  const toggleComplete = async (id: string) => {
    await toggleTask(id);
    setTasks(await getTasks());
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Task Manager</h1>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Input
          value={taskObject.title}
          onChange={(e) =>
            setTaskObject({ ...taskObject, title: e.target.value })
          }
          placeholder="Enter a task"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {taskObject.dueDate
                ? format(taskObject.dueDate, "PPP")
                : "Pick Due Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              selected={taskObject.dueDate!}
              onSelect={(date) =>
                setTaskObject({ ...taskObject, dueDate: date ?? null })
              }
            />
          </PopoverContent>
        </Popover>

        <Input
          className="col-span-2"
          value={taskObject.description}
          onChange={(e) =>
            setTaskObject({ ...taskObject, description: e.target.value })
          }
          placeholder="Enter description"
        />
      </div>
      <Button
        disabled={loading}
        className="w-[100px] mx-auto block"
        onClick={handleAddTask}
      >
        {loading
          ? editingTask
            ? "Updating..."
            : "Adding..."
          : editingTask
          ? "Update"
          : "Add"}{" "}
      </Button>
      <div className="space-y-3 mt-6">
        {tasks.map((taskObject) => (
          <Card
            key={taskObject._id}
            className="p-4 flex justify-between items-center"
          >
            <div className="flex flex-col">
              <div
                className={`flex-1 text-lg font-medium ${
                  taskObject.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {taskObject.task.title}
              </div>
              <div
                className={`flex-1 ${
                  taskObject.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {taskObject.task.description}
              </div>
              <div>
                <strong>Due:</strong> {formatDate(taskObject.task.dueDate)}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleComplete(taskObject._id)}
              >
                <CheckCircle className="text-green-500" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setTaskObject({
                    title: taskObject.task.title,
                    description: taskObject.task.description,
                    dueDate: taskObject.task.dueDate,
                  });
                  setEditingTask(taskObject);
                }}
              >
                <Edit className="text-blue-500" />
              </Button>
              <Button
                disabled={loading}
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteTask(taskObject._id)}
              >
                <Trash2 className="text-white" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
