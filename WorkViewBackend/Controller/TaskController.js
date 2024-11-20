const Task = require("../Models/Task");
const TeamLeader = require("../Models/TeamLeader");
const User = require("../Models/User");

exports.individualAssignTaskController = async (req, res, next) => {
  const { title, description, deadLine, assignedTo, createdBy } = req.body;

  const task = new Task({
    title,
    description,
    deadline: deadLine,
    assignedTo,
    createdBy,
  });

  try {
    const savedTask = await task.save();

    const updateResult = await TeamLeader.updateOne(
      { _id: createdBy },
      { $push: { tasks: savedTask._id } }
    );
    const updateUser = await User.updateOne(
      { _id: assignedTo },
      { $push: { tasks: savedTask._id } }
    );
    if (updateUser.modifiedCount === 0 || updateResult.modifiedCount === 0) {
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
    updateUser = await User.updateOne(
      { _id: assignedTo },
      { $pull: { tasks: taskId } }
    );
    if (
      updateUser.modifiedCount === 0 ||
      result.deletedCount === 0 ||
      updateLeader.modifiedCount === 0
    ) {
      return res.json({ error: "Unable to Update tasks" });
    }
    return res.json(result);
  } catch (error) {
    return res.json({ error });
  }
};
