const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllProviders,
  approveProvider,
  rejectProvider,
  suspendProvider,
  getAllUsers,
  toggleUserStatus,
  getAllAppointments,
  getAllPets,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All Admin routes require authentication and ADMIN role
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.get('/providers', getAllProviders);
router.patch('/providers/:id/approve', approveProvider);
router.patch('/providers/:id/reject', rejectProvider);
router.patch('/providers/:id/suspend', suspendProvider);

router.get('/users', getAllUsers);
router.patch('/users/:id/status', toggleUserStatus);

router.get('/appointments', getAllAppointments);
router.get('/pets', getAllPets);

module.exports = router;
