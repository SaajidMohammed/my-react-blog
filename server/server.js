// 1. Import Dependencies
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Import Models, Routes, and Middleware
const Post = require('./models/Post');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');

// 2. Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Setup Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log(' MongoDB connected successfully.'))
.catch(err => console.error(' MongoDB connection error:', err));

// 5. Configure Multer for File Upload Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// 6. Define API Routes

// --- Authentication Routes ---
app.use('/api/auth', authRoutes);

// --- Blog Post Routes ---

// GET: Fetch posts with author info
app.get('/api/posts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    let query = Post.find().sort({ createdAt: -1 })
      .populate('author', 'username');

    if (!isNaN(limit) && limit > 0) {
      query = query.limit(limit);
    }
    const posts = await query;
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

// GET: Fetch a single post by its ID with author info
app.get('/api/posts/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate('author', 'username');
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching post', error: error.message });
    }
});

// POST: Create a new post (now saves correct author and imagePath)
app.post('/api/posts', authMiddleware, upload.single('postImage'), async (req, res) => {
  const { title, content } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required.' });
  }

  const newPost = new Post({
    title,
    content,
    
    imagePath: 'uploads/' + req.file.filename,
    author: req.userId,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: 'Error creating post', error: error.message });
  }
});

// DELETE: Delete a post
app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'User not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id); 
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});

// PUT: Update a post
app.put('/api/posts/:id', authMiddleware, upload.single('postImage'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'User not authorized to edit this post' });
        }

        post.title = title;
        post.content = content;
        
        if (req.file) {
            //  CORRECTED: Use req.file.filename if a new image is uploaded
            post.imagePath = 'uploads/' + req.file.filename;
        }

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error: error.message });
    }
});


// 7. Start the Server
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});