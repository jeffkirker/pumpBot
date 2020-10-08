const mongoose = require("mongoose");

const mentionsSchema = mongoose.Schema({
  Company: { type: String, required: true },
  Timeframe: { type: String, required: true },
  Dates: [{ type: String, required: true }],
  mentions: {
    overall: [Number],
    vaderPos: [Number],
    vaderNeu: [Number],
    vaderNeg: [Number],
    tbPost: [Number],
    tbNeu: [Number],
    tbNeg: [Number],
  },
  Price: [{ type: Number, required: true }],
});

module.exports = mentionsSchema;
