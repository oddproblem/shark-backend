import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Team from '../models/Team.js';

// Utility: Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '8h' }
  );
};

// Helper: Validate email format
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Register Team Head
export const registerTeamHead = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      regNumber,
      contactNumber,
      alternateNumber,
      members
    } = req.body;

    // ✅ Required fields check
    if (!name || !email || !password || !regNumber || !contactNumber || !alternateNumber) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // ✅ Email format validation
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // ✅ Password length validation
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // ✅ Contact number validation
    if (!/^\d{10}$/.test(contactNumber) || !/^\d{10}$/.test(alternateNumber)) {
      return res.status(400).json({ message: 'Contact numbers must be 10 digits' });
    }

    // ✅ Team head email uniqueness
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // ✅ Team name uniqueness (per user)
    const teamName = `${name}'s Team`;
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team name already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create team head user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'team-head',
      regNumber,
      contactNumber,
      alternateNumber
    });

    // Create team with members
    const teamMembers = (members || []).map((m) => ({
      name: m.name || '',
      regNumber: m.regNumber || ''
    }));

    const team = await Team.create({
      teamName,
      teamHead: user._id,
      members: teamMembers
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Registered successfully',
      teamId: team._id,
      role: user.role,
      name: user.name,
      token
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    res.json({
      message: 'Logged in',
      role: user.role,
      name: user.name,
      token
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

// Logout
export const logout = (req, res) => {
  res.json({ message: 'Logged out' });
};
