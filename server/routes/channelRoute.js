const { getAllChannels, createChannel} = require("../controllers/channelController");

const router = require("express").Router();

router.post("/addChannel", createChannel);
router.get("/allChannels", getAllChannels);
module.exports = router;