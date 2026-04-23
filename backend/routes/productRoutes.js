const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const auth = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");
const upload = require("../middleware/upload");

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.post("/", auth, authorizeRole("admin"), upload.single("image"), createProduct);
router.put("/:id", auth, authorizeRole("admin"), upload.single("image"), updateProduct);
router.delete("/:id", auth, authorizeRole("admin"), deleteProduct);

module.exports = router;