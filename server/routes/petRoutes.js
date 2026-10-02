const express = require('express');
const router = express.Router();
const {
  getMyPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} = require('../controllers/petController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', authorize('PET_OWNER', 'ADMIN'), getMyPets);
router.post('/', authorize('PET_OWNER'), createPet);
router.get('/:id', authorize('PET_OWNER', 'ADMIN'), getPetById);
router.put('/:id', authorize('PET_OWNER', 'ADMIN'), updatePet);
router.delete('/:id', authorize('PET_OWNER', 'ADMIN'), deletePet);

module.exports = router;
