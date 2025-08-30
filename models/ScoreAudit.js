import mongoose from 'mongoose';

const ScoreAuditSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  oldScores: Object,
  newScores: Object,
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ScoreAudit', ScoreAuditSchema);
