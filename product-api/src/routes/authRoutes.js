const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const authController = require("../controllers/authController");

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/admin/create', authMiddleware, roleMiddleware, authController.createAdmin);

module.exports = router;