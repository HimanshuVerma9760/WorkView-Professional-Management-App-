require("dotenv").config();
const mongoose = require("mongoose");
const TeamLeader = require("../Models/TeamLeader");
const User = require("../Models/User");

async function database() {
  const connUri = process.env.CONN_URI;
  try {
    const response = await mongoose.connect(connUri);
    if (response) {
      console.log("Successfully connected to Database!");

      const leaders = await TeamLeader.find().exec();
      for (const leader of leaders) {
        const updatedTeamMembers = [];

        for (const member of leader.teamMembers) {
          const exists = await User.findById(member);
          if (exists) {
            updatedTeamMembers.push(member);
          }
        }

        if (updatedTeamMembers.length !== leader.teamMembers.length) {
          leader.teamMembers = updatedTeamMembers;
          await leader.save();
          console.log(`Updated team members for leader ${leader._id}`);
        }
      }
    } else {
      console.log("Error! while connecting to database!");
    }
  } catch (err) {
    console.error(
      "Error connecting to database or updating team members:",
      err
    );
  }
}

exports.database = database;
