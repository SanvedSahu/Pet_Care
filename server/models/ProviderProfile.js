const mongoose = require('mongoose');

const providerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    providerType: {
      type: String,
      required: [true, 'Provider type is required'],
      enum: {
        values: ['Veterinarian', 'Pet Groomer', 'Pet Trainer'],
        message: '{VALUE} is not an authorized provider type',
      },
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
    qualification: {
      type: String,
      required: [true, 'Qualification / License is required'],
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location / City is required'],
      trim: true,
    },
    approvalStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Suspended'],
      default: 'Pending',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1.0,
      max: 5.0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
providerProfileSchema.index({ approvalStatus: 1, providerType: 1 });
providerProfileSchema.index({ location: 1 });

module.exports = mongoose.model('ProviderProfile', providerProfileSchema);
