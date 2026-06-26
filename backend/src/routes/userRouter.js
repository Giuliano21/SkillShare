const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

const verifyToken = require('../middlewares/authMiddleware');

router.route('/me')
    .get(verifyToken, UserController.getMe)
    .post(verifyToken, UserController.updateMe)
    .delete(verifyToken, UserController.deleteMe);

module.exports = router;