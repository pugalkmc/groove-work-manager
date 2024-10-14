import User from '../database/models/User.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { SERVER_URL, JWT_SECRET, PASSKEY } from '../config.js';
import crypto from 'crypto';
import Activation from '../database/models/Activation.js'; // Assuming the Activation model is in models folder
import moment from 'moment-timezone';


// Utility function to validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

import nodemailer from 'nodemailer';

// Function to send activation email using Outlook
const sendActivationEmailWithOutlook = async (senderIpAddress, email, activationToken) => {
  try {
    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'groovework.notifier@gmail.com', // Your Gmail account
        pass: PASSKEY, // Your Gmail password or app password
      },
    });

    const timestampIST = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    
    // Email options
    const mailOptions = {
      from: 'groovework.notifier@gmail.com', // Sender address
      to: email, // Recipient address
      subject: 'Account Activation - No Reply',
      text: `Hello, and welcome to Team Groove!\n\n` +
            `We are excited to have you on board. Please click the following link to activate your account:\n\n` +
            `http://localhost:3000/activate/${activationToken}\n\n` +
            `If you have any questions, feel free to reach out to us.\n\n` +
            `Best Regards,\nTeam Groove\n` +
            `Signup from IP: ${senderIpAddress}\nTimestamp: ${timestampIST}`,
      html: `<p>Hello, and welcome to <strong>Team Groove</strong>!</p>` +
            `<p>We are excited to have you on board. Please click the following link to activate your account:</p>` +
            `<p><a href=${SERVER_URL}/activate/${activationToken}>Activate Account</a></p>` +
            `<p>If you have any questions, feel free to reach out to us.</p>` +
            `<p>Best Regards,<br>Team Groove</p>` +
            `<p>Signup from IP: <strong>${senderIpAddress}</strong><br>Timestamp: <strong>${timestampIST}</strong></p>`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending activation email:', error);
  }
};



const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (!user.isActivated){
      return res.status(400).json({ error: 'Account was not activated, check your email and click your activation link, make sure to check your spam folder'})
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token with only necessary information
    const token = jwt.sign(
      { _id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return the token to the client
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Registration API with activation process
const register = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    // Validate name length
    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({ error: 'Name must be between 2 and 50 characters.' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Validate phone number format
    if (phoneNumber.length !== 10) {
      return res.status(400).json({ error: 'Invalid phone number format.' });
    }

    // Check if user with the same email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'Email already exists. Please login to continue.' });
    }

    // Check if user with the same phone number already exists
    const existingUserByPhone = await User.findOne({ phoneNumber });
    if (existingUserByPhone) {
      return res.status(400).json({ error: 'Phone number already exists.' });
    }

    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique activation token
    const activationToken = crypto.randomBytes(32).toString('hex');
    await sendActivationEmailWithOutlook(req.ip, email, activationToken);

    // Create new user object
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber
    });

    // Save user to the database
    const savedUser = await newUser.save();

    // Create an activation record in the Activation collection
    const newActivation = new Activation({
      userId: savedUser._id,
      activationToken
    });

    await newActivation.save();

    // Return success message (you can send the activationToken for front-end purposes)
    return res.status(200).json({
      message: 'User registered successfully. Please verify your email to activate your account.',
      activationToken // For testing purposes; in a real app, you would send it via email
    });
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Verify activation token and activate the user
const verifyAccount = async (req, res) => {
  const { token } = req.params;

  try {
    // Check if activation token exists in the Activation collection
    const activationRecord = await Activation.findOne({ activationToken: token });

    if (!activationRecord) {
      return res.status(400).json({ error: 'Invalid or expired activation token.' });
    }

    // Activate the user's account
    const userId = activationRecord.userId;
    await User.updateOne({ _id: userId }, { $set: { isActivated: true } });

    // Delete the activation record after successful verification
    await Activation.deleteOne({ activationToken: token });

    return res.status(200).json({ message: 'Account verified and activated successfully.' });
  } catch (err) {
    console.error('Error verifying account:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};



export { login, register, verifyAccount };