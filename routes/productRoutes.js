const express = require("express");
const checkAuthUser = require("../middlerware/checkAuthUser");

const router = express.Router();
const {
  createData,
  getAll,
  getOne,
  updateData,
  deleteData,
} = require("../controllers/productController");

router.use(checkAuthUser);

router.route("/").get(getAll);
router.route("/").post(createData);
router.route("/:id").get(getOne).put(updateData).delete(deleteData);

module.exports = router;
