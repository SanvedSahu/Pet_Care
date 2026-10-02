const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getServices);
router.get('/:id', getServiceById);

router.post('/', protect, authorize('SERVICE_PROVIDER'), createService);
router.put('/:id', protect, authorize('SERVICE_PROVIDER', 'ADMIN'), updateService);
router.delete('/:id', protect, authorize('SERVICE_PROVIDER', 'ADMIN'), deleteService);

module.exports = router;
