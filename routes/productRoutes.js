const express = require("express");
const checkAuth = require("../middlerware/checkAuth");

const router = express.Router();
const {
  createData,
  getAll,
  getOne,
  updateData,
  deleteData,
} = require("../controllers/productController");

router.use(checkAuth);

router.route("/").get(getAll);
router.route("/").post(createData);
router.route("/:id").get(getOne).put(updateData).delete(deleteData);

module.exports = router;
