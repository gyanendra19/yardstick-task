import { SingleTask } from "@/app/page";
import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  task: SingleTask;
  completed: boolean;
}

const TaskSchema = new Schema<ITask>({
  task: { type: Object, required: true },
  completed: { type: Boolean, default: false },
});

export const Task = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
