const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId, // Stores the User's unique ID
    ref: 'User', // Links this to the 'User' model
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;