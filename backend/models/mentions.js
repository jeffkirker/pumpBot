const mongoose = require("mongoose");

const mentionsSchema = mongoose.Schema({
  company: { type: String, required: true },
  timeframe: { type: String, required: true },
  dates: [{ type: String, required: true }],
  mentions: {
    overall: [Number],
    vaderPos: [Number],
    vaderNeu: [Number],
    vaderNeg: [Number],
    tbPost: [Number],
    tbNeu: [Number],
    tbNeg: [Number],
  },
  price: [{ type: Number, required: true }],
});

module.exports = mentionsSchema;
