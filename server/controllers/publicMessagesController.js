const PublicMessages = require("../model/publicMessageModel");

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const {from, room} = req.body;

    const messages = await PublicMessages.find({room:room}).sort({ updatedAt: 1 });
    const projectedMessages = messages.map((msg) => {
      return {
        name:msg.name,
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        time: msg.createdAt
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, room, name, message } = req.body;
    const data = await PublicMessages.create({
      name:name,
      room: room,
      message: { text: message },
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};