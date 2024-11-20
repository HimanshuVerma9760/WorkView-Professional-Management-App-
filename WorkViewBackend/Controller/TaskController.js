const Task = require("../Models/Task");
const TeamLeader = require("../Models/TeamLeader");

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

    if (updateResult.modifiedCount === 0) {
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
