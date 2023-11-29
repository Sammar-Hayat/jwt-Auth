const express = require("express");
const checkAuthAdmin = require("../middlerware/checkAuthAdmin");

const router = express.Router();
const {
  signUp,
  signIn,
  getAll,
  getOne,
  updateData,
  deleteData,
} = require("../controllers/authController");

// router.use(checkAuthAdmin);

router.route("/signup").post(checkAuthAdmin, signUp);
router.route("/signin").post(signIn);
router.route("/users").get(checkAuthAdmin, getAll);
router
  .route("/users/:id")
  .get(checkAuthAdmin, getOne)
  .put(checkAuthAdmin, updateData)
  .delete(checkAuthAdmin, deleteData);

module.exports = router;
