const Interview_Model = require("../models/Interview");
const User_Model = require("../models/User");
const nodemailer = require("nodemailer");

const addInterview = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let { start_time, end_time, participants, admin } = req.body;

  if (participants.length < 2) return res.status(422).send("");

  const interviews = await Interview_Model.find({
    $or: [
      { start_time: { $gte: start_time, $lt: end_time } },
      { end_time: { $gte: start_time, $lt: end_time } },
      {
        $and: [
          { start_time: { $lt: start_time } },
          { end_time: { $gt: end_time } },
        ],
      },
    ],
  });

  if (interviews.length) {
    // Same admin
    if (interviews.some((el) => el.admin === admin)) {
      return res.status(422).send("");
    }

    // Same participant
    if (
      interviews.some((el) =>
        el.participants.some((p) => participants.includes(p))
      )
    ) {
      return res.status(422).send("");
    }
  }

  const newInterview = new Interview_Model({
    start_time,
    end_time,
    participants,
    admin,
  });

  newInterview
    .save()
    .then(async (data) => {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: "kartikscalertest@gmail.com", pass: "bqhoovngswadcfou" },
      });

      const populatedParticipants = await User_Model.find(
        { _id: { $in: participants } },
        { email: 1, _id: 0 }
      );

      let mailOptions = {
        from: "kartikscalertest@gmail.com",
        bcc: populatedParticipants.map((p) => p.email),
        subject: "Interview Scheduled",
        text: `Interview Scheduled for ${start_time} to ${end_time}`,
      };

      transporter.sendMail(mailOptions, (e, info) => {
        if (e) return res.send("Interview added but unable to send email");
      });

      return res.json("Added and mail sent");
    })
    .catch((err) => console.log(err));
};

const getInterview = async (req, res) => {
  await Interview_Model.find({ userId: req.query.userId })
    .populate("admin", { name: 1, _id: 0 })
    .then((user) => res.json(user));
};

const getInterviewById = async (req, res) => {
  let interviewID = req.params.id;
  await Interview_Model.findById(interviewID)
    .populate("admin", { name: 1 })
    .populate("participants")
    .then((data) =>
      res.status(200).json({
        message: "Found",
        data: data,
      })
    )
    .catch((e) =>
      res.status(500).json({
        message: "Something went wrong, please try again later.",
      })
    );
};

const updateInterview = async (req, res) => {
  try {
    let { start_time, end_time, participants, admin } = req.body;

    start_time = new Date(start_time);
    end_time = new Date(end_time);

    if (participants.length < 2) res.status(422).send("");

    const interviews = await Interview_Model.find({
      $or: [
        { start_time: { $gte: start_time, $lt: end_time } },
        { end_time: { $gte: start_time, $lt: end_time } },
      ],
    });

    if (interviews.length) {
      // Same admin
      if (interviews.some((el) => el.admin === admin)) {
        res.status(422).send("");
      }

      // Same participant
      if (
        interviews.some((el) =>
          el.participants.some((p) => participants.includes(p))
        )
      ) {
        res.status(422).send("");
      }
    }

    await Interview_Model.findByIdAndUpdate(req.params.id, {
      start_time,
      end_time,
      participants,
      admin,
    });

    res.json({ msg: "Update Success!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  addInterview,
  getInterview,
  getInerviewById: getInterviewById,
  updateInterview,
};
