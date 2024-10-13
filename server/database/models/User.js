import mongoose from 'mongoose';

const { Schema } = mongoose;

// Create a schema for the user
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        // Simple email validation regex
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        // Simple phone number validation (assuming 10 digits, adjust if needed)
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Set minimum password length
    validate: {
      validator: function (v) {
        // Custom validation: at least one number, one special character, and one uppercase letter
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v);
      },
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.'
    }
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  payments: {
    binance: {
      type: Number,
      required: false, // Can be null
    },
    UPIID: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          // Simple UPI ID validation (adjust as needed)
          return /^[\w.-]+@[\w.-]+$/.test(v);
        },
        message: props => `${props.value} is not a valid UPI ID!`
      }
    }
  },
  skills: {
    type: [String], // Array of strings
    default: []
  },
  skillsUpdatedAt: {
    type: Date,
    default: null
  },
  isActivated: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now // Sets the current timestamp as default
  },
  createdAt: {
    type: Date,
    default: Date.now // Sets the current timestamp as default
  }
});

// Middleware to update the skillsUpdatedAt field whenever skills are modified
userSchema.pre('save', function (next) {
  if (this.isModified('skills')) {
    this.skillsUpdatedAt = new Date();
  }
  next();
});

// Middleware to update updatedAt on any change
userSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.updatedAt = new Date(); // Update updatedAt to current time
  }
  next();
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

export default User;
