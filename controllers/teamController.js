import Team from '../models/Team.js';
import mongoose from 'mongoose';

// Get current user's team
export const getMyTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ teamHead: req.user.id })
      .populate('teamHead', 'name email')
      .lean();
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Assign category to team
export const selectCategory = async (req, res) => {
  try {
    const team = await Team.findOne({ teamHead: req.user.id });
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (team.category) {
      return res.status(400).json({ message: 'Category already assigned' });
    }

    // Count current number of teams in each category
    const categoryCounts = await Team.aggregate([
      { $match: { category: { $ne: null } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const counts = [0, 0, 0]; // for categories 1,2,3
    categoryCounts.forEach(c => {
      counts[c._id - 1] = c.count;
    });

    // Pick category with least users
    const minCount = Math.min(...counts);
    const catIndex = counts.indexOf(minCount);
    const assignedCategory = catIndex + 1;

    team.category = assignedCategory;
    await team.save();

    res.json({ message: 'Category assigned successfully', category: assignedCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ New: Return fixed categories
export const getCategories = async (req, res) => {
  try {
    const categories = [
      { _id: 1, name: 'Category1' },
      { _id: 2, name: 'Category2' },
      { _id: 3, name: 'Category3' },
    ];
    res.json({ categories });
  } catch (err) {
    console.error('Get Categories Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
