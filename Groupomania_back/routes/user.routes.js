const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const userAuth = require("../middleware/auth.middleware");
const uploadAuth = require("../middleware/auth.middleware");
const uploadController = require("../controllers/upload.controller");
const multer = require("multer");
const upload = multer();

//auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

//users
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userAuth.isUserAuth, userController.updateUser);
//router.delete('/:id', userController.deleteUser)

//upload
router.post(
  "/upload",
  upload.single("file"),
  uploadAuth.isUploadAuth,
  uploadController.uploadProfil
);

module.exports = router;
