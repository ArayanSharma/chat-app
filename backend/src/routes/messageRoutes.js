const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

router.post("/", async (req, res) => {
  const message = await Message.create(req.body);
  res.json(message);
});

router.get("/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;

  const messages = await Message.find({
    $or: [
      {
        senderId,
        receiverId,
      },
      {
        senderId: receiverId,
        receiverId: senderId,
      },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
});

module.exports = router;