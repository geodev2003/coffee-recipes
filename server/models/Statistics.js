const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

const visitorSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true
  },
  visitedAt: {
    type: Date,
    default: Date.now
  },
  userAgent: String,
  path: String,
  sessionId: String
}, { timestamps: true });

const View = mongoose.model('View', viewSchema);
const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = { View, Visitor };

