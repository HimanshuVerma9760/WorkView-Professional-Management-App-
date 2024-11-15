const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User", // References the user assigned to this task
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "TeamLeader", // References the team leader who created the task
  },
  deadline: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
