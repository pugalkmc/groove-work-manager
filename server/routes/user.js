import express from 'express';
import User from '../database/models/User.js';
import bcrypt from 'bcryptjs'; 
import crypto from 'crypto'; 

const router = express.Router();

// Middleware would have set `req.user` with user details (e.g., userId)

// Add a skill to the user
router.post('/skills', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
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
    const user = await User.findById(req.user.id);
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
    const user = await User.findById(req.user.id);
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

// Get user's skills
router.get('/skills', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('skills');
    if (!user) return res.status(404).send('User not found');
    
    res.status(200).send(user.skills);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get user profile without skills
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-skills -password'); // Exclude skills and password
    if (!user) return res.status(404).send('User not found');
    
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Edit user's phone number
router.put('/phoneNumber', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send('User not found');
    
    user.phoneNumber = req.body.phoneNumber;
    await user.save();
    res.status(200).send('Phone number updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Edit user's name
router.put('/name', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send('User not found');

    user.name = req.body.name;
    await user.save();
    res.status(200).send('Name updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Edit user's password
router.put('/password', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
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

    res.status(200).send(`Reset token (simulate sending via email): ${resetToken}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;