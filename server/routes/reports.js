const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// User routes
router.get('/my', authMiddleware.verifyToken, reportController.getMyReports);
router.post('/', authMiddleware.verifyToken, reportController.createReport);

// Admin routes
router.get('/', authMiddleware.verifyToken, adminMiddleware, reportController.getReports);
router.put('/:id', authMiddleware.verifyToken, adminMiddleware, reportController.updateReport);
router.get('/stats', authMiddleware.verifyToken, adminMiddleware, reportController.getReportStats);

module.exports = router;
