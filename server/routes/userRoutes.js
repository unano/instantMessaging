const {
  register,
  login,
  getAllUsers,
  getUser,
} = require("../controllers/usersControlller");

const multer = require("multer");
const storage = multer.diskStorage({
    destination:(req, file, callback) =>{
        callback(null,"./public/src/images")
    },
    filename:(req, file, callback) =>{
        callback(null, file.originalname);
        // Date.now() + 
    }
})

const upload = multer({storage:storage});

const router = require("express").Router();

router.post("/register", upload.single("image") , register);
router.post("/login", login);
router.get("/allusers/:id", getAllUsers);
router.get("/user/:name", getUser);

module.exports = router;