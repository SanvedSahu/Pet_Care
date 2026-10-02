const Pet = require('../models/Pet');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all pets owned by logged-in user
// @route   GET /api/pets
// @access  Private (PET_OWNER)
const getMyPets = async (req, res, next) => {
  try {
    const pets = await Pet.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return successResponse(res, 200, 'Pets retrieved successfully', pets);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pet by ID
// @route   GET /api/pets/:id
// @access  Private (PET_OWNER)
const getPetById = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return errorResponse(res, 404, 'Pet not found');
    }

    if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return errorResponse(res, 403, 'Unauthorized. You do not own this pet profile');
    }

    return successResponse(res, 200, 'Pet retrieved successfully', pet);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private (PET_OWNER)
const createPet = async (req, res, next) => {
  try {
    const {
      name,
      species,
      breed,
      gender,
      age,
      dateOfBirth,
      weight,
      medicalNotes,
      vaccinationStatus,
      image,
    } = req.body;

    if (!name || !species || age === undefined || weight === undefined) {
      return errorResponse(res, 400, 'Please provide name, species, age, and weight for your pet');
    }

    const pet = await Pet.create({
      owner: req.user._id,
      name,
      species,
      breed: breed || 'Mixed / Unknown',
      gender: gender || 'Unknown',
      age: Number(age),
      dateOfBirth,
      weight: Number(weight),
      medicalNotes: medicalNotes || 'No known pre-existing medical conditions.',
      vaccinationStatus: vaccinationStatus || 'Up to Date',
      image: image || undefined,
    });

    return successResponse(res, 201, 'Pet profile created successfully', pet);
  } catch (error) {
    next(error);
  }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private (PET_OWNER)
const updatePet = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return errorResponse(res, 404, 'Pet not found');
    }

    if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return errorResponse(res, 403, 'Unauthorized. You do not own this pet profile');
    }

    const allowedUpdates = [
      'name',
      'species',
      'breed',
      'gender',
      'age',
      'dateOfBirth',
      'weight',
      'medicalNotes',
      'vaccinationStatus',
      'image',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        pet[field] = req.body[field];
      }
    });

    const updatedPet = await pet.save();
    return successResponse(res, 200, 'Pet profile updated successfully', updatedPet);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private (PET_OWNER)
const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return errorResponse(res, 404, 'Pet not found');
    }

    if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return errorResponse(res, 403, 'Unauthorized. You do not own this pet profile');
    }

    await pet.deleteOne();
    return successResponse(res, 200, 'Pet profile deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
};
