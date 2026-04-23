const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");
const auth = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

router.get("/", getAllCategories);
router.post("/", auth, authorizeRole("admin"), createCategory);
router.put("/:id", auth, authorizeRole("admin"), updateCategory);
router.delete("/:id", auth, authorizeRole("admin"), deleteCategory);

module.exports = router;