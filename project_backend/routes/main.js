const express = require("express");
require("dotenv").config();
const router = express.Router();
require("dotenv").config();

const userController = require("../controllers/user");

const interviewController = require("../controllers/interview");

router.post("/addtointerview", interviewController.addInterview);

router.get("/interview/:id", interviewController.getInerviewById);

router.put("/updateinterview/:id", interviewController.updateInterview);

router.post("/addUser", userController.addUser);

router.get("/user", userController.getUser);

router.get("/getinterview", interviewController.getInterview);

module.exports = router;