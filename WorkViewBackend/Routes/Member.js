const express = require("express");
const { postMember } = require("../Controller/memberController");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const member = router.post(
  "/api-create-member",
  [
    body("memberName")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters"),
    body("memberEmail")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email format"),
    body("memberPassword")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("teamCode")
      .trim()
      .escape()
      .isLength({ min: 10, max: 10 })
      .withMessage("Team Code must be 10 characters"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  postMember
);

exports.member = member;
