const { register } = require("../controllers/usersControlller");

const router = require("express").Router();

router.post("/register", register);

module.exports = router;