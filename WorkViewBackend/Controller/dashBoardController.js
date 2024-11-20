const TeamLeader = require("../Models/TeamLeader");

module.exports = async (req, res, next) => {
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
