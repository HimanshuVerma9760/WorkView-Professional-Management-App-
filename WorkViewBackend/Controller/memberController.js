const TeamLeader = require("../Models/TeamLeader");
const User = require("../Models/User");

const postMember = async (req, res) => {
  try {
    const memberData = req.body;

    if (
      !memberData.memberName ||
      !memberData.memberEmail ||
      !memberData.memberPassword ||
      !memberData.teamCode
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let teamLeaderId;

    const existingMember = await User.findOne({
      email: memberData.memberEmail,
    });
    const teamLeader = await TeamLeader.findOne({
      teamCode: memberData.teamCode,
    });
    if (teamLeader) {
      teamLeaderId = teamLeader._id;
    } else {
      return res.status(400).json({ error: "This Team Code is invalid" });
    }
    if (existingMember) {
      return res
        .status(400)
        .json({ error: "Member already exist, kindly Log in!" });
    } else {
      const member = new User({
        name: memberData.memberName,
        email: memberData.memberEmail,
        password: memberData.memberPassword,
        teamCode: memberData.teamCode,
        teamLeader: teamLeaderId,
      });

      try {
        const result = await member.save();

        teamLeader.teamMembers.push(result._id);
        const updatedTeamLeader = await teamLeader.save();

        return res.json({ newMember: result, updatedTeamLeader });
      } catch (error) {
        console.error("Error saving member and updating team leader:", error);
        return res.status(500).json({
          error:
            "An error occurred while saving member or updating team leader.",
        });
      }
    }
  } catch (error) {
    console.error("Error creating team member:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the team member" });
  }
};
exports.postMember = postMember;
