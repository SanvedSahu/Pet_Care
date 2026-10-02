const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProviderProfile',
      required: [true, 'Service must be linked to a provider profile'],
    },
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      maxlength: [80, 'Service name cannot exceed 80 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [400, 'Description cannot exceed 400 characters'],
    },
    category: {
      type: String,
      enum: {
        values: ['Veterinary', 'Grooming', 'Training', 'General'],
        message: '{VALUE} is not a supported category',
      },
      default: 'General',
    },
    price: {
      type: Number,
      required: [true, 'Service price is required'],
      min: [0, 'Price must be 0 or positive'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [10, 'Duration must be at least 10 minutes'],
      max: [240, 'Duration cannot exceed 240 minutes'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
serviceSchema.index({ provider: 1 });
serviceSchema.index({ category: 1 });

module.exports = mongoose.model('Service', serviceSchema);
