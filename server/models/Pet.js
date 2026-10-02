const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Pet must be associated with an owner'],
    },
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
      maxlength: [40, 'Pet name cannot exceed 40 characters'],
    },
    species: {
      type: String,
      required: [true, 'Species is required'],
      enum: {
        values: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'],
        message: '{VALUE} is not a supported species',
      },
    },
    breed: {
      type: String,
      trim: true,
      default: 'Mixed / Unknown',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unknown'],
      default: 'Unknown',
    },
    age: {
      type: Number,
      required: [true, 'Age in years is required'],
      min: [0, 'Age cannot be negative'],
      max: [40, 'Age exceeds standard life expectancy'],
    },
    dateOfBirth: {
      type: Date,
    },
    weight: {
      type: Number,
      min: [0, 'Weight must be a positive number'],
      required: [true, 'Weight in kg is required'],
    },
    medicalNotes: {
      type: String,
      trim: true,
      default: 'No known pre-existing medical conditions.',
    },
    vaccinationStatus: {
      type: String,
      enum: ['Up to Date', 'Partially Vaccinated', 'Not Vaccinated', 'Unknown'],
      default: 'Up to Date',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
petSchema.index({ owner: 1 });
petSchema.index({ species: 1 });

module.exports = mongoose.model('Pet', petSchema);
