import mongoose from 'mongoose';
import crypto from 'crypto';

const certificateSchema = new mongoose.Schema(
  {
    // Certificate ID: YYSSCCC format
    certificateId: {
      type: String,
      required: [true, 'Certificate ID is required'],
      unique: true,
      uppercase: true,
      match: [/^\d{7}$/, 'Certificate ID must be 7 digits (YYSSCCC format)'],
      index: true,
    },

    // Recipient Information
    recipientName: {
      type: String,
      required: [true, 'Recipient name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    recipientEmail: {
      type: String,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
      index: true,
    },

    // Program Information
    program: {
      type: String,
      enum: [
        'Web Development',
        'Mobile Development',
        'Machine Learning',
        'Algorithms & Data Structures',
        'Programming Fundamentals',
        'Full Stack Development',
        'Cloud Computing',
        'Cybersecurity',
        'Other',
      ],
      required: [true, 'Program is required'],
    },

    programCategory: {
      type: String,
      enum: ['00', '01', '02', '03'],
      required: true,
      description: '00=Main Club, 01=Online Chapter, 02=Bootcamp, 03=Advanced',
    },

    awardDate: {
      type: Date,
      required: [true, 'Award date is required'],
      default: Date.now,
    },

    // Verification Information
    verificationHash: {
      type: String,
      unique: true,
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: true,
      index: true,
    },

    verificationCount: {
      type: Number,
      default: 0,
    },

    lastVerifiedAt: Date,

    // Metadata
    issuedBy: {
      type: String,
      default: 'STEM CS Club',
    },

    certificateUrl: String,

    // File storage
    certificateFileId: {
      type: String,
      index: true,
    },

    certificateFileName: String,

    // Security: Track certificate validity
    revokedAt: {
      type: Date,
      default: null,
    },

    revocationReason: String,

    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Additional fields
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },

    verifiedIPs: [String],

    // Audit fields
    createdBy: String,
    updatedBy: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for year
certificateSchema.virtual('year').get(function () {
  return '20' + this.certificateId.substring(0, 2);
});

// Virtual for serial number
certificateSchema.virtual('serialNumber').get(function () {
  return this.certificateId.substring(4, 7);
});

// Indexes for performance
certificateSchema.index({ certificateId: 1, isVerified: 1 });
certificateSchema.index({ recipientEmail: 1 });
certificateSchema.index({ awardDate: -1 });
certificateSchema.index({ createdAt: -1 });

// Pre-save middleware
certificateSchema.pre('save', function (next) {
  // Generate verification hash if not exists
  if (!this.verificationHash) {
    const emailPart = this.recipientEmail || 'no-email';
    const hash = crypto
      .createHash('sha256')
      .update(this.certificateId + emailPart + new Date().getTime())
      .digest('hex');
    this.verificationHash = hash;
  }

  // Normalize email
  if (this.recipientEmail) {
    this.recipientEmail = this.recipientEmail.toLowerCase().trim();
  }

  // Normalize name
  if (this.recipientName) {
    this.recipientName = this.recipientName.trim();
  }

  next();
});

// Static method to find by certificate ID
certificateSchema.statics.findByCertificateId = function (certId) {
  return this.findOne({ certificateId: certId.toUpperCase() });
};

// Static method to verify certificate ID format
certificateSchema.statics.isValidCertificateIdFormat = function (certId) {
  return /^\d{7}$/.test(String(certId));
};

const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);

export default Certificate;
