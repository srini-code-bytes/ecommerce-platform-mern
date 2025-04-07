
const express = require("express");
const { getAllUsers } = require("../../controllers/admin/user-controller");
const router = express.Router();

router.get("/get-users", getAllUsers);

module.exports = router;