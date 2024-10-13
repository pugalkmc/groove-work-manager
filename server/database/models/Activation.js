import mongoose from 'mongoose';

const { Schema } = mongoose;

// Schema for account activation
const activationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  activationToken: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: { expires: '1d' } // Automatically delete after 1 day (24 hours)
  },
  isActivated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now // Timestamp for creation
  }
});

// Middleware to automatically set the expiration time
activationSchema.pre('save', function (next) {
  if (!this.expiresAt) {
    // Set the token expiration to 24 hours from now
    const now = new Date();
    this.expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  }
  next();
});

// Create the Activation model from the schema
const Activation = mongoose.model('Activation', activationSchema);

export default Activation;
