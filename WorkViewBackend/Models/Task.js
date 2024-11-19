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
  notes: {
    type: String,
    default: "",
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "TeamLeader",
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
