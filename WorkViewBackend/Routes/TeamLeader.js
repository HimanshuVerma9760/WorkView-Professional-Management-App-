const express = require("express");
const {
  postTeamLeader,
  checkTeamLeader,
} = require("../Controller/teamLeaderController");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.post(
  "/api-create-team-leader",
  [
    body("leaderName").trim().escape(),
    body("leaderEmail").trim().isEmail().normalizeEmail().escape(),
    body("leaderPassword")
      .trim()
      .escape()
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 character long"),
  ],
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(500).json({ error: "Bad Data...!" });
    }
    next();
  },
  postTeamLeader
);
router.post(
  "/api-login-team-leader",
  [
    body("leaderEmail").trim().isEmail().normalizeEmail().escape(),
    body("leaderPassword")
      .trim()
      .escape()
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 character long"),
  ],
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(500).json({ error: "Bad Data...!" });
    }
    next();
  },
  checkTeamLeader
);

exports.teamLeader = router;
