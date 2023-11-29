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

// router.use(checkAuth);

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/").get(checkAuthAdmin,getAll);
// router.route("/:id").get(getOne).put(updateData).delete(deleteData);

module.exports = router;
