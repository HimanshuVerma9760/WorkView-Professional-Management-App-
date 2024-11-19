const TeamLeader = require("../Models/TeamLeader");

module.exports = async (req, res, next) => {
  try {
    const { email, name, teamCode, teamMembers, tasks } =
      await TeamLeader.findById(req.id).populate("teamMembers");
    res.json({
      message: "Welcome to Dashboard",
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
