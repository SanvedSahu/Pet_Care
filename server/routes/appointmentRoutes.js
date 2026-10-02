const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getProviderAppointments,
  updateAppointmentStatus,
  getBookedSlots,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/booked-slots', getBookedSlots);

router.use(protect);

router.post('/', authorize('PET_OWNER'), bookAppointment);
router.get('/my', authorize('PET_OWNER'), getMyAppointments);
router.get('/provider', authorize('SERVICE_PROVIDER'), getProviderAppointments);
router.patch('/:id/status', updateAppointmentStatus);

module.exports = router;
