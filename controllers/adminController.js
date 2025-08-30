import Team from '../models/Team.js';
import mongoose from 'mongoose';
import ScoreAudit from '../models/ScoreAudit.js';
import User from '../models/User.js';

// Dashboard for admin / manager
export const getDashboard = async (req, res) => {
  try {
    const teams = await Team.find().populate('teamHead', 'name email').lean();
    teams.forEach(team => {
      if (!team.category) team.category = null; // keep it null until user selects
    });
    res.json({ teams });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Assign score (admin or manager) with round support
export const assignScore = async (req, res) => {
  try {
    const { teamId, score, round = 1 } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    if (!teamId || score === undefined)
      return res.status(400).json({ message: 'Missing fields' });

    const s = Number(score);
    if (isNaN(s) || s < 0 || s > 100)
      return res.status(400).json({ message: 'Score must be 0-100' });

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // Ensure the round object exists
    let roundObj = team.rounds.find(r => r.roundNumber === round);
    if (!roundObj) {
      roundObj = { roundNumber: round, scores: [], averageScore: 0, qualified: false };
      team.rounds.push(roundObj);
    }

    // Save old scores for audit
    const oldScores = JSON.parse(JSON.stringify(roundObj.scores));

    // Check if current user already has a score
    const existingByUser = roundObj.scores.find(
      x => x.judge && x.judge.toString() === userId.toString()
    );

    if (existingByUser) {
      existingByUser.score = s;
      existingByUser.updatedAt = new Date();
    } else {
      roundObj.scores.push({ judge: userId, score: s, updatedAt: new Date() });
    }

    // Calculate average for this round only
    const validScores = roundObj.scores.filter(x => x.score !== null && x.score !== undefined);
    roundObj.averageScore = validScores.length
      ? Math.round((validScores.reduce((acc, j) => acc + j.score, 0) / validScores.length) * 100) / 100
      : 0;

    // Update totalScore as sum of all round averages
    team.totalScore = team.rounds.reduce((acc, r) => acc + (r.averageScore || 0), 0);

    await team.save();

    // Score audit
    const changedBy = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : null;
    if (!changedBy) return res.status(400).json({ message: 'Invalid user ID' });

    await ScoreAudit.create({
      team: team._id,
      oldScores,
      newScores: roundObj.scores,
      changedBy,
      role,
      round
    });

    res.json({ message: `Score assigned for Round ${round}`, team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Compute top 2 qualifiers per category (round-based)
export const computeQualifiers = async (req, res) => {
  try {
    const round = Number(req.query.round) || 1;
    const teams = await Team.find().lean();
    const categories = [...new Set(teams.map(t => t.category))];
    const qualifiers = [];

    categories.forEach(cat => {
      const catTeams = teams.filter(t => t.category === cat);

      catTeams.sort((a, b) => {
        const aAvg = a.rounds?.find(r => r.roundNumber === round)?.averageScore || 0;
        const bAvg = b.rounds?.find(r => r.roundNumber === round)?.averageScore || 0;
        return bAvg - aAvg;
      });

      qualifiers.push(...catTeams.slice(0, 2));
    });

    res.json({ qualifiers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Compute top 3 winners (round-based)
export const computeWinners = async (req, res) => {
  try {
    const round = Number(req.query.round) || 1;
    const teams = await Team.find().lean();

    teams.sort((a, b) => {
      const aAvg = a.rounds?.find(r => r.roundNumber === round)?.averageScore || 0;
      const bAvg = b.rounds?.find(r => r.roundNumber === round)?.averageScore || 0;
      return bAvg - aAvg;
    });

    const winners = teams.slice(0, 3);
    res.json({ winners });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
