const User = require("../Models/User");

module.exports = async (req, res, next) => {
  const { name, email, teamCode } = await User.findById(req.id);
  res.json({ name, email, teamCode });
};
