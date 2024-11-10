const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamLeaderSchema = new Schema({
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
    default: "Team Leader",
  },
  teamCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  teamMembers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

const TeamLeader = mongoose.model("TeamLeader", teamLeaderSchema);
module.exports = TeamLeader;
