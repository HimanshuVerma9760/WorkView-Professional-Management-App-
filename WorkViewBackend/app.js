const express = require("express");
const cors = require("cors");
const { database } = require("./util/database");
const { teamLeader } = require("./Routes/TeamLeader");
const { member } = require("./Routes/Member");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/team-leader", teamLeader);
app.use("/member", member);

database();
app.listen(port, () =>
  console.log(`WorkView Server listening on port ${port}!`)
);
