const express = require("express");

const router = express.Router();
const {
  createData,
  getAll,
  getOne,
  updateData,
  deleteData,
} = require("../controllers/authController");

router.route("/signup").get(getAll).post(createData);
// router.route("/:id").get(getOne).put(updateData).delete(deleteData);

module.exports = router;
