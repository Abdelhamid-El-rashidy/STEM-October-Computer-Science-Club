import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'VERIFY', 'REVOKE', 'LOGIN', 'LOGOUT'],
      required: true,
      index: true,
    },

    entityType: {
      type: String,
      enum: ['CERTIFICATE', 'ADMIN', 'USER'],
      required: true,
    },

    entityId: String,

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },

    performedByUsername: String,

    ipAddress: String,

    userAgent: String,

    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      default: 'SUCCESS',
    },

    details: mongoose.Schema.Types.Mixed,

    errorMessage: String,

    changes: {
      before: mongoose.Schema.Types.Mixed,
      after: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    index: { createdAt: -1 },
  }
);

// Compound indexes for common queries
auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
auditLogSchema.index({ performedBy: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
