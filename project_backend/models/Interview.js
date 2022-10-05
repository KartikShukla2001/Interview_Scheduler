const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  start_time: {
    type: Date,
  },
  end_time: {
    type: Date,
  },
  participants: [{ type: mongoose.Types.ObjectId, ref: "user" }],
  admin: {
    type: mongoose.Types.ObjectId, ref: "user"
  },
});

const interview = mongoose.model("interview", interviewSchema);
module.exports = interview;
