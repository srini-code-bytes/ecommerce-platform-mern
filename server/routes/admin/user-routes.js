const express = require("express");
const { getAllUsers } = require("../../controllers/admin/user-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const router = express.Router();

router.get("/get-all-users", authMiddleware, getAllUsers);

module.exports = router;
