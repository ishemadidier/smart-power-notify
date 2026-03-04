const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// All routes require authentication and admin role
router.get('/', authMiddleware.verifyToken, adminMiddleware, userController.getUsers);
router.get('/stats', authMiddleware.verifyToken, adminMiddleware, userController.getUserStats);
router.get('/districts', authMiddleware.verifyToken, userController.getDistricts);
router.get('/sectors', authMiddleware.verifyToken, userController.getSectors);
router.get('/:id', authMiddleware.verifyToken, adminMiddleware, userController.getUserById);
router.put('/:id', authMiddleware.verifyToken, adminMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware.verifyToken, adminMiddleware, userController.deleteUser);

module.exports = router;

