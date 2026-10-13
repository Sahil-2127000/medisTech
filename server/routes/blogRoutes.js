const express = require('express');
const router = express.Router();
const { createBlog, getAllBlogs, getBlogById } = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireDoctor } = authMiddleware;

// Create a blog post
router.post('/', authMiddleware, requireDoctor, createBlog);

// Get all blogs
router.get('/', getAllBlogs);

// Get a single blog
router.get('/:id', getBlogById);

module.exports = router;
