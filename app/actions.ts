"use server";

import { connectDB } from "@/lib/db";
import { Task } from "@/models/task";
import { SingleTask, Task as TaskProp } from "./page";

export async function getTasks() {
    await connectDB();
    const tasks = await Task.find().lean(); // Converts Mongoose docs to plain objects
    return tasks.map((taskObject: any) => ({
      _id: taskObject._id.toString(), // Convert ObjectId to string
      task: taskObject.task,
      completed: taskObject.completed,
    }));
  }
  
export async function addTask(task: SingleTask) {
  await connectDB();
  const newTask = new Task({ task });
  await newTask.save();
}

export async function deleteTask(id: string) {
  await connectDB();
  await Task.findByIdAndDelete(id);
}

export async function editTask(id: string, task: SingleTask) {
    await connectDB()    
    await Task.findByIdAndUpdate(id, {task: task})
}

export async function toggleTask(id: string) {
  await connectDB();
  const task = await Task.findById(id);
  if (task) {
    task.completed = !task.completed;
    await task.save();
  }
}
