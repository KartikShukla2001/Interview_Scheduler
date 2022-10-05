const User_Model = require("../models/User");

const getUser = async (req, res) => {
  User_Model.find({ userId: req.query.userId }).then((user) => res.json(user));
};

const addUser = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { name,isAdmin,email } = req.body;
  const newUser = new User_Model({
    name,
    isAdmin,
    email
  });
  newUser
    .save()
    .then((data) => {
      res.status(200).json("Added");
    })
    .catch((err) => console.log(err));
};

const getMembership = async (req, res) => {
  console.log(req.query.userId);
  Membership_Model.find({ userId: req.query.userId }).then((membership) =>
    res.json(membership)
  );
};
module.exports = {
  getUser,
  addUser
};
