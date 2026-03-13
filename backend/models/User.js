const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ],
  },

  password: {
    type: String,
    required: function () {
      // Password required only if Google login not used
      return !this.googleId;
    },
    minlength: [6, 'Password must be at least 6 characters'],
  },

  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },

  avatar: {
    type: String,
    default: null,
  },

  profilePicture: {
    type: String,
    default: null,
  },

  lastLogin: {
    type: Date,
    default: Date.now,
  },

  isActive: {
    type: Boolean,
    default: true,
  }
},
{
  timestamps: true   // automatically creates createdAt & updatedAt
}
);

//
// 🔐 HASH PASSWORD BEFORE SAVE
//
userSchema.pre('save', async function () {

  if (!this.isModified('password') || !this.password) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

});

//
// 🔑 COMPARE PASSWORD (LOGIN)
//
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

//
// EXPORT MODEL
//
module.exports = mongoose.model('User', userSchema);