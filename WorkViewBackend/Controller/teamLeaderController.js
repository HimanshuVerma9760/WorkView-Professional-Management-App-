const TeamLeader = require("../Models/TeamLeader");

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
      const leader = new TeamLeader({
        name: leaderData.leaderName,
        email: leaderData.leaderEmail,
        password: leaderData.leaderPassword,
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

exports.postTeamLeader = postTeamLeader;
