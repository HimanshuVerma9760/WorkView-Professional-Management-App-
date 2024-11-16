const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Member",
  },
  teamCode:{
    type:String,
    required:true,
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task", // References tasks assigned to this user
    },
  ],
  teamLeader: {
    type: Schema.Types.ObjectId,
    ref: "TeamLeader", // References the team leader managing this user
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
