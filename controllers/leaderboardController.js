import Team from '../models/Team.js';

export const getLeaderboard = async (req, res) => {
  try {
    const teams = await Team.find().populate('teamHead', 'name').lean();

    // Sort by totalScore descending
    teams.sort((a, b) => b.totalScore - a.totalScore);

    // Assign ranks
    let lastScore = null, rank = 0, offset = 1;
    teams.forEach(t => {
      if (t.totalScore !== lastScore) {
        rank = offset;
        lastScore = t.totalScore;
      }
      t.rank = rank;
      offset++;
    });

    // Only send category if it exists
    const result = teams.map(t => ({
      ...t,
      category: t.category || null
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
