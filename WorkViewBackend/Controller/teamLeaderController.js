const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const TeamLeader = require("../Models/TeamLeader");
const Task = require("../Models/Task");

async function generateUniqueCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  const existingTeamCode = await TeamLeader.findOne({ teamCode: code });
  if (existingTeamCode) {
    return await generateUniqueCode();
  }

  return code;
}

const postTeamLeader = async (req, res) => {
  try {
    const leaderData = req.body;

    if (
      !leaderData.leaderName ||
      !leaderData.leaderEmail ||
      !leaderData.leaderPassword
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingLeader = await TeamLeader.findOne({
      email: leaderData.leaderEmail,
    });
    if (existingLeader) {
      return res
        .status(500)
        .json({ error: "Team-Leader already exist, kindly Log in!" });
    } else {
      const uniqueCode = await generateUniqueCode();
      const hashedPassword = await bcrypt.hash(leaderData.leaderPassword, 10);
      const leader = new TeamLeader({
        name: leaderData.leaderName,
        email: leaderData.leaderEmail,
        password: hashedPassword,
        teamCode: uniqueCode,
      });

      const result = await leader.save();
      return res.json(result);
    }
  } catch (error) {
    console.error("Error creating team leader:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the team leader" });
  }
};

const checkTeamLeader = async (req, res, next) => {
  const { leaderEmail, leaderPassword } = req.body;

  const teamLeader = await TeamLeader.findOne({
    email: leaderEmail,
  });
  if (teamLeader) {
    const verifyLeader = await bcrypt.compare(
      leaderPassword,
      teamLeader.password
    );
    if (verifyLeader) {
      console.log("login successfull");
      const token = jwt.sign(
        { id: teamLeader._id, email: teamLeader.email },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      return res.json({ message: "Login Successfull", token });
    } else {
      return res.status(500).json({ error: "Invalid Credentials" });
    }
  } else {
    return res.status(500).json({ error: "Invalid Credentials" });
  }
};

exports.getTeamLeaderTasks = async (req, res, next) => {
  try {
    const id = req.id;
    const tasks = await Task.find({ createdBy: id }).populate("assignedTo", "name");
    if (tasks) {
      return res.json({ message: "tasks sent", tasks });
    } else {
      return res.status(500).json({ error: "Cannot find the tasks!" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

exports.postTeamLeader = postTeamLeader;
exports.checkTeamLeader = checkTeamLeader;
