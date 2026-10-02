const express = require('express');
const router = express.Router();
const {
  getPublicProviders,
  getProviderById,
  getMyProviderProfile,
  updateMyProviderProfile,
} = require('../controllers/providerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getPublicProviders);
router.get('/me', protect, authorize('SERVICE_PROVIDER'), getMyProviderProfile);
router.put('/me', protect, authorize('SERVICE_PROVIDER'), updateMyProviderProfile);
router.get('/:id', getProviderById);

module.exports = router;
