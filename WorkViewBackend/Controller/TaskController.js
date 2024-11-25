const Task = require("../Models/Task");
const TeamLeader = require("../Models/TeamLeader");
const User = require("../Models/User");

exports.individualAssignTaskController = async (req, res, next) => {
  const { title, description, deadLine, assignedTo, createdBy } = req.body;

  const todaysDate = Date.now();
  const setDate = Date.parse(deadLine);
  if (isNaN(setDate)) {
    return res.status(500).json({ error: "Invalid date!" });
  } else if (setDate - todaysDate < 0) {
    return res
      .status(500)
      .json({ error: "Date cannot be earlier than today's date!" });
  }
  let groupTask = false;
  if (assignedTo.length > 1) {
    groupTask = true;
  }
  const task = new Task({
    title,
    description,
    deadline: deadLine,
    assignedTo,
    createdBy,
    groupTask,
  });

  try {
    const savedTask = await task.save();
    const updateUsers = await User.updateMany(
      { _id: { $in: assignedTo } },
      { $push: { tasks: savedTask._id } }
    );

    const updateResult = await TeamLeader.updateOne(
      { _id: createdBy },
      { $push: { tasks: savedTask._id } }
    );
    if (updateUsers.modifiedCount === 0 || updateResult.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "TeamLeader not found or update failed." });
    }

    return res.status(201).json(savedTask);
  } catch (error) {
    console.error(
      "Error occurred while saving task or updating leader:",
      error
    );
    return res.status(500).json({
      message: "An error occurred. Please try again later.",
      error: error.message,
    });
  }
};

exports.removeTask = async (req, res, next) => {
  const { taskId, createdBy, assignedTo } = req.body;
  let result, updateLeader, updateUser;
  try {
    result = await Task.deleteOne({ _id: taskId });
    updateLeader = await TeamLeader.updateOne(
      { _id: createdBy },
      { $pull: { tasks: taskId } }
    );
  } catch (error) {
    console.log("caught error while deleting task in leader!");
    return res.status(500).json({ error });
  }
  try {
    console.log("AssignedTo before deleting:", assignedTo);
    updateUser = await User.updateMany(
      { _id: { $in: assignedTo } },
      { $pull: { tasks: taskId } }
    );
  } catch (error) {
    console.log("caught error while deleting task in user!");
    return res.status(500).json({ error });
  }
  if (
    updateUser.modifiedCount === 0 ||
    result.deletedCount === 0 ||
    updateLeader.modifiedCount === 0
  ) {
    console.log("Error occured");
    return res.status(500).json({ error: "Unable to Update tasks" });
  }
  console.log("Succesfull deletion of task!");
  return res.json(result);
};
