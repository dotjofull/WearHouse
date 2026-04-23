const express = require("express");
const router = express.Router();
const { registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  deleteUser, } = require("../controllers/userController");
const auth = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, getMyProfile);
router.put("/profile", auth, updateMyProfile);
router.get("/", auth, authorizeRole("admin"), getAllUsers);
router.delete("/:id", auth, authorizeRole("admin"), deleteUser);
    
router.get("/admin-test", auth, authorizeRole("admin"), (req, res) => {
  res.status(200).json({ message: "Welcome Admin" });
});
module.exports = router;