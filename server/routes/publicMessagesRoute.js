const { addMessage, getAllMessage } = require("../controllers/publicMessagesController");
const router = require("express").Router();

router.post("/addAllMsg/", addMessage);
router.post("/getAllMsg/", getAllMessage);

module.exports = router;