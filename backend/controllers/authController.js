import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing username or password' });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const userObj = user.toObject();
    delete userObj.password;

    const accessToken = generateToken(user._id.toString(), user.role || 'customer');
    const refreshToken = generateRefreshToken(user._id.toString());

    return res.json({ user: userObj, token: accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing username or password' });

    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: 'Username already in use' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const email = `${username}@example.com`;
    const fullname = username;
    const phoneNumber = '0000000000';

    const user = new User({
      username,
      fullname,
      email,
      password: hashed,
      role: 'customer',
      phoneNumber,
      addresses: [],
    });

    await user.save();
    const userObj = user.toObject();
    delete userObj.password;

    const accessToken = generateToken(user._id.toString(), user.role || 'customer');
    const refreshToken = generateRefreshToken(user._id.toString());

    return res.status(201).json({ user: userObj, token: accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const adminOnly = (req, res) => {
  return res.json({ message: 'Hello admin' });
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Missing refresh token' });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newAccessToken = generateToken(user._id.toString(), user.role || 'customer');
    const newRefreshToken = generateRefreshToken(user._id.toString());

    return res.json({
      user,
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default { login, register, profile, adminOnly, refreshToken };
