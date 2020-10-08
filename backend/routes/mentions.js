const express = require("express");

const MentionsController = require("../controllers/mentions");

const router = express.Router();

router.get("/:timeframe/:ticker", MentionsController.getMentions);

module.exports = router;