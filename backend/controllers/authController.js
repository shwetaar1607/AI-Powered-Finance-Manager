const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require('crypto');
const {transporter} = require('../emailConfig');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.user._id); // req.user from protect middleware

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // Will be hashed by pre-save hook

    const updatedUser = await user.save();

    res.json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
      token: generateToken(updatedUser._id), // New token after update
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Profile update failed", error: error.message });
  }
};


let currentOtp = '';

exports.sendOtp = async (req,res)=>{
  const { email } = req.body;
  try {
    const user = await User.findOne({email});
    if (!user) return res.status(404).json({ message: 'User not found' });
    currentOtp = crypto.randomInt(100000, 999999).toString();
    // send email configuration
    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #555;">
            Hello,<br><br>
            We received a request to reset your password. Please use the OTP below to proceed:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #007BFF; color: white; font-size: 24px; font-weight: bold; padding: 12px 24px; border-radius: 6px;">
              ${currentOtp}
            </span>
          </div>
          <p style="font-size: 14px; color: #777;">
            This OTP is valid for the next 10 minutes. If you did not request a password reset, you can safely ignore this email.
          </p>
          <p style="font-size: 14px; color: #555;">
            Best regards,<br>
            The Finance Team
          </p>
        </div>
      `
    });
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP failed", error: error.message });
  }
}
exports.reSentOtp = async (req,res)=>{
  const { email } = req.body;
  try {
    const user = await User.findOne({email});
    if (!user) return res.status(404).json({ message: 'User not found' });
    currentOtp = crypto.randomInt(100000, 999999).toString();
    // send email configuration
    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Password Reset new OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #555;">
            Hello,<br><br>
            We received a request to reset your password. Please use the new OTP below to proceed:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #007BFF; color: white; font-size: 24px; font-weight: bold; padding: 12px 24px; border-radius: 6px;">
              ${currentOtp}
            </span>
          </div>
          <p style="font-size: 14px; color: #777;">
            This OTP is valid for the next 10 minutes. If you did not request a password reset, you can safely ignore this email.
          </p>
          <p style="font-size: 14px; color: #555;">
            Best regards,<br>
            The Finance Team
          </p>
        </div>
      `
    });
    res.json({ message: 'New OTP sent successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error re-sending OTP failed", error: error.message });
  }
}

exports.verifyOtp = (req, res) => {
  const { otp } = req.body;

  if (otp === currentOtp) {
    res.json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
};

exports.updatePassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = password;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password' });
  }
};