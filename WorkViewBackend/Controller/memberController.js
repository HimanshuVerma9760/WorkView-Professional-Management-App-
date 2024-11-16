const TeamLeader = require("../Models/TeamLeader");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
      const hashedPassword = await bcrypt.hash(memberData.memberPassword, 10);
      const member = new User({
        name: memberData.memberName,
        email: memberData.memberEmail,
        password: hashedPassword,
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

const checkMember = async (req, res, next) => {
  console.log("checkMember");
  try {
    const { memberEmail, memberPassword, teamCode } = req.body;
    console.log(memberEmail);
    const exsistingMember = await User.findOne({ email: memberEmail });
    if (exsistingMember) {
      const verifyPass = await bcrypt.compare(
        memberPassword,
        exsistingMember.password
      );
      if (verifyPass && teamCode === exsistingMember.teamCode) {
        const token = jwt.sign(
          { id: exsistingMember._id, email: exsistingMember.email },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
        );
        console.log("Successfull login");
        return res.json({ message: "Successfull login!", token });
      } else {
        return res.status(500).json({ error: "Authentication Failed!" });
      }
    } else {
      return res.status(500).json({ error: "Invalid Credentials!" });
    }
  } catch (error) {
    console.log("error in checkMember catch block:", error);
    return res.status(500).json({ error: error });
  }
};

exports.checkMember = checkMember;
exports.postMember = postMember;
