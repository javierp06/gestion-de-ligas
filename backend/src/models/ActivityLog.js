const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete', 'login', 'logout', 'register']
  },
  resource: {
    type: String,
    required: true,
    enum: ['user', 'league', 'tournament', 'team', 'match', 'player', 'stats']
  },
  resourceId: {
    type: Number
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  collection: 'activity_logs'
});

// Índice compuesto para búsquedas comunes
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ resource: 1, action: 1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
