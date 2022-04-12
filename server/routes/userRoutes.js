const { register, login, setAvatar, getAllUsers, getUser } = require("../controllers/usersControlller");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id" , setAvatar);
router.get("/allusers/:id", getAllUsers);
router.get("/user/:name", getUser);

module.exports = router;