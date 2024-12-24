const User = require("../Models/User");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.id).populate({
      path: "tasks",
      populate: {
        path: "assignedTo", 
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      teamCode: user.teamCode,
      tasks: user.tasks,
    });
  } catch (error) {
    console.error("Error in middleware:", error);
    res.status(500).json({ error: error.message });
  }
};
