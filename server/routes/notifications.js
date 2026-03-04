const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Public routes (for user notifications)
router.get('/', authMiddleware.verifyToken, notificationController.getNotifications);
router.get('/my', authMiddleware.verifyToken, notificationController.getUserNotifications);

// Admin routes
router.post('/', authMiddleware.verifyToken, adminMiddleware, notificationController.createNotification);
router.put('/:id', authMiddleware.verifyToken, adminMiddleware, notificationController.updateNotification);
router.delete('/:id', authMiddleware.verifyToken, adminMiddleware, notificationController.deleteNotification);
router.get('/stats', authMiddleware.verifyToken, adminMiddleware, notificationController.getNotificationStats);

module.exports = router;
