const express = require('express');
const router = express.Router();
const { 
  generatePost, 
  generatePosts, 
  generateId 
} = require('../data/generator');

// In-memory storage
let posts = generatePosts(20);

// GET all posts
router.get('/', (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedPosts = posts.slice(startIndex, endIndex);
  
  return res.json({
    status: 'success',
    count: posts.length,
    data: paginatedPosts,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(posts.length / limit)
  });
});

// GET a single post by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const post = posts.find(post => post.id === id);
  
  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: `Post with ID ${id} not found`
    });
  }
  
  return res.json({
    status: 'success',
    data: post
  });
});

// GET posts by user ID
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userPosts = posts.filter(post => post.userId === userId);
  
  return res.json({
    status: 'success',
    count: userPosts.length,
    data: userPosts
  });
});

// POST a new post
router.post('/', (req, res) => {
  const newPost = { ...generatePost(), ...req.body, id: generateId() };
  posts.push(newPost);
  
  return res.status(201).json({
    status: 'success',
    message: 'Post created successfully',
    data: newPost
  });
});

// PUT update a post
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex(post => post.id === id);
  
  if (postIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: `Post with ID ${id} not found`
    });
  }
  
  const updatedPost = { ...posts[postIndex], ...req.body };
  posts[postIndex] = updatedPost;
  
  return res.json({
    status: 'success',
    message: 'Post updated successfully',
    data: updatedPost
  });
});

// PATCH update a post partially
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex(post => post.id === id);
  
  if (postIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: `Post with ID ${id} not found`
    });
  }
  
  const updatedPost = { ...posts[postIndex], ...req.body };
  posts[postIndex] = updatedPost;
  
  return res.json({
    status: 'success',
    message: 'Post updated successfully',
    data: updatedPost
  });
});

// DELETE a post
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex(post => post.id === id);
  
  if (postIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: `Post with ID ${id} not found`
    });
  }
  
  const deletedPost = posts[postIndex];
  posts = posts.filter(post => post.id !== id);
  
  return res.json({
    status: 'success',
    message: 'Post deleted successfully',
    data: deletedPost
  });
});

// DELETE all posts and regenerate
router.delete('/', (req, res) => {
  const count = req.query.count || 20;
  posts = generatePosts(count);
  
  return res.json({
    status: 'success',
    message: `All posts deleted and regenerated ${count} new posts`,
    count: posts.length
  });
});

module.exports = router; 