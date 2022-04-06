const router = require("express").Router();
const Conversation = require("../model/Conversation");

//create conversation
router.post("/", async (req, res) => {
  try {
    const existingConversation = await Conversation.findOne({
      members: { $all: [req.body.sender, req.body.receiver] },
    });

    if (existingConversation) return res.status(200).json(existingConversation);

    const newConversation = new Conversation({
      members: [req.body.sender, req.body.receiver],
    });
    await newConversation.save();

    res.status(200).json(newConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conversation
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
