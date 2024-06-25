const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Kullanıcı kaydı (signup) işlevi
const signup = async (req, res) => {
  const { username, email, password, fullName, address, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
      address,
      phone,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Kullanıcı girişi (login) işlevi
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Auth failed: User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Auth failed: Invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { username, email, fullName, address, phone } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, email, fullName, address, phone },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const deleteUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getUserDetails = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
 
  const logout = async (req, res) => {
    const { NODE_ENV } = process.env;
  
    try {
      // HTTP only cookie olarak token'ı null olarak ayarlayarak kullanıcıyı çıkış yapmış olarak kabul ediyoruz.
      res.cookie('token', null, {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === 'development' ? false : true,
      });
  
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  
  

module.exports = {
  signup,
  login,
  listUsers,
  updateUser,
  deleteUser,
  getUserDetails,
  logout
};
