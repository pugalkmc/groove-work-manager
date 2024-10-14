import express from 'express';
import User from '../database/models/User.js';
import bcrypt from 'bcryptjs'; 
import crypto from 'crypto'; 

const router = express.Router();

// Middleware would have set `req.user` with user details (e.g., userId)

// Add a skill to the user
router.post('/skills', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send('User not found');
    
    user.skills.push(req.body.skill);
    await user.save();
    res.status(200).send('Skill added successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Edit a skill of the user
router.put('/skills/:skillIndex', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send('User not found');

    const { newSkill } = req.body;
    const skillIndex = req.params.skillIndex;

    if (skillIndex >= 0 && skillIndex < user.skills.length) {
      user.skills[skillIndex] = newSkill;
      await user.save();
      res.status(200).send('Skill edited successfully');
    } else {
      res.status(400).send('Invalid skill index');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a skill of the user
router.delete('/skills/:skillIndex', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send('User not found');

    const skillIndex = req.params.skillIndex;
    if (skillIndex >= 0 && skillIndex < user.skills.length) {
      user.skills.splice(skillIndex, 1); // Remove the skill from the array
      await user.save();
      res.status(200).send('Skill deleted successfully');
    } else {
      res.status(400).send('Invalid skill index');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Get all skills API
router.get('/skills/all', async (req, res) => {
  try {
    const users = await User.find({}, 'skills');
    const allSkills = new Set();

    users.forEach(user => {
      user.skills.forEach(skill => allSkills.add(skill));
    });

    // console.log(allSkills);
    res.json(Array.from(allSkills)); // Return unique skills as an array
  } catch (error) {
    console.error('Error fetching all unique skills:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Get user's skills
router.get('/skills', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('skills');
    if (!user) return res.status(200).send('User not found');
    
    res.status(200).send(user.skills);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get user profile without skills
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-skills -password'); // Exclude skills and password
    if (!user) return res.status(401).send('User not found');
    
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.put('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-skills -password'); // Exclude skills and password
    if (!user) return res.status(401).send('User not found');
    
    user.phoneNumber = req.body.phoneNumber;
    user.name = req.body.name;
    user.bio = req.body.bio;
    await user.save();
    res.status(200).send('Profile updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Edit user's password
router.put('/password', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send('User not found');

    const { oldPassword, newPassword } = req.body;

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).send('Old password is incorrect');

    // Hash the new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send('Password updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Forgot password (generates reset token)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Optionally, store this token in DB with an expiration date or send it via email.
    // Example: user.resetToken = resetToken; await user.save();

    res.status(200).send("This option is currently unavailable");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;