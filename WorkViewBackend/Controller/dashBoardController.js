const Task = require("../Models/Task");
const TeamLeader = require("../Models/TeamLeader");

module.exports = async (req, res, next) => {
  try {
    const tasks = await Task.find({ createdBy: req.id });
    tasks.map(async (eachTask) => {
      if (Date.parse(eachTask.deadline) - Date.now() < 0) {
        eachTask.status = "Not Completed";
        await eachTask.save();
      }
    });
  } catch (error) {
    console.log("error occured while updating tasks deadline: ", error);
    res.json({ error: "Some Error Occured during updating tasks deadline" });
  }
  try {
    const { _id, email, name, teamCode, teamMembers, tasks } =
      await TeamLeader.findById(req.id)
        .populate("teamMembers")
        .populate("tasks");

    res.json({
      message: "Welcome to Dashboard",
      _id,
      email,
      name,
      teamCode,
      teamMembers,
      tasks,
    });
  } catch (error) {
    res.json({ message: "Error occured!!", error: error });
  }
};
