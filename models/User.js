import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true, // ✅ email unique across DB
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },

  password: {
    type: String,
    required: true
  },

  regNumber: {
    type: String,
    required: true,
    unique: true, // ✅ reg number unique across DB
    uppercase: true,
    trim: true
  },

  contactNumber: {
    type: String,
    required: true,
    unique: true, // ✅ only one user can have this number
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} must be a 10-digit number!`
    }
  },

  alternateNumber: {
    type: String,
    required: false, // optional
    validate: {
      validator: function (v) {
        return !v || /^\d{10}$/.test(v);
      },
      message: props => `${props.value} must be a 10-digit number!`
    }
  },

  role: {
    type: String,
    enum: ['team-head', 'admin', 'event-manager'],
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ ensure unique indexes in MongoDB
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ regNumber: 1 }, { unique: true });
UserSchema.index({ contactNumber: 1 }, { unique: true });

export default mongoose.model('User', UserSchema);
