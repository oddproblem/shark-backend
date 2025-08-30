import mongoose from 'mongoose';

// Judge slot schema
const judgeSlotSchema = new mongoose.Schema({
  judge: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  score: { type: Number, default: null },
  updatedAt: { type: Date, default: null }
}, { _id: false });

// Round schema
const roundSchema = new mongoose.Schema({
  roundNumber: { type: Number, required: true },
  scores: { type: [judgeSlotSchema], default: [] },
  averageScore: { type: Number, default: 0 },
  qualified: { type: Boolean, default: false }
}, { _id: false });

// Member schema (❌ removed unique)
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  regNumber: { type: String, required: true, trim: true }
}, { _id: false });

const TeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true, trim: true },
  teamHead: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  members: { type: [memberSchema], default: [] },

  category: { type: Number, enum: [1, 2, 3], default: null },
  attendance: { type: Boolean, default: false },

  rounds: { type: [roundSchema], default: [] },

  totalScore: { type: Number, default: 0 },
  round: { type: Number, default: 1 },
  qualified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Prevent duplicate member regNumbers **inside the same team**
TeamSchema.pre('save', function (next) {
  const regNumbers = this.members.map(m => m.regNumber);
  if (new Set(regNumbers).size !== regNumbers.length) {
    return next(new Error('Duplicate member regNumber found in the team'));
  }
  next();
});

export default mongoose.model('Team', TeamSchema);
