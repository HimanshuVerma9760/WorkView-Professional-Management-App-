const TeamLeader = require("../Models/TeamLeader");

module.exports = async (req, res, next) => {
  const { email, name, teamCode } = await TeamLeader.findById(req.leaderId);
  res.json({ message: "Welcome to Dashboard", email, name, teamCode });
};
