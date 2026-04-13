const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String, // We'll store Base64 string or an external URL
    required: true,
  },
  author: {
    type: String,
    default: 'Doctor'
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);
