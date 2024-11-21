const express = require("express");
const {
  postTeamLeader,
  checkTeamLeader,
  getTeamLeaderTasks,
} = require("../Controller/teamLeaderController");
const { body, validationResult } = require("express-validator");
const Auth = require("../Controller/Auth");
const dashBoardController = require("../Controller/dashBoardController");
const {
  individualAssignTaskController,
  removeTask,
} = require("../Controller/TaskController");
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

router.use(Auth);
router.get("/dashboard", dashBoardController);
router.post(
  "/dashboard/assign-task",
  [
    body("title")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Title must be atleast 3 character long"),
    body("description")
      .trim()
      .escape()
      .isLength({ min: 15 })
      .withMessage("description must be atleast 15 character long"),
    body("deadLine").trim().escape(),
    body("assignedTo").trim().escape(),
    body("createdBy").trim().escape(),
  ],
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(500).json({ error: "Bad Data...!" });
    }
    next();
  },
  individualAssignTaskController
);
router.post(
  "/remove-task",
  [
    body("taskId")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Must have a taskId"),
    body("createdBy")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Must have a createdBy"),
    body("assignedTo")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Must have a assignedTo"),
  ],
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(500).json({ error: "Bad Data...!" });
    }
    next();
  },
  removeTask
);

router.get("/get-updated-leader-data", getTeamLeaderTasks);

exports.teamLeader = router;
