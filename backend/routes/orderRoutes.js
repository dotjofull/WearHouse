const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const auth = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

router.post("/", auth, placeOrder);
router.get("/my", auth, getMyOrders);
router.get("/:id", auth, getSingleOrder);
router.get("/", auth, authorizeRole("admin"), getAllOrders);
router.put("/:id/status", auth, authorizeRole("admin"), updateOrderStatus);
module.exports = router;