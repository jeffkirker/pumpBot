const MentionsSchema = require("../models/mentions");
const mongoose = require("mongoose");

exports.getMentions = (req, res, next) => {
  console.log("Mentions requested");
  const Mentions = mongoose.model(
    "Mentions",
    MentionsSchema,
    req.params.timeframe
  );
  Mentions.find({
    company: req.params.ticker,
  })
    .then((mentions) => {
      if (mentions) {
        res.status(200).json(mentions);
        console.log(mentions);
      } else {
        res.status(404).json({ message: "Mentions not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching mentions failed" });
    });
};
