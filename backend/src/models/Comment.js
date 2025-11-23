const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  matchId: {
    type: Number,
    required: true,
    index: true
  },
  userId: {
    type: Number,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userAvatar: {
    type: String
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: Number
  }],
  replies: [{
    userId: {
      type: Number,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'comments'
});

// Índice para búsquedas rápidas de comentarios por partido
commentSchema.index({ matchId: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
