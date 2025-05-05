const express = require('express');
const router = express.Router();
const { 
  generateComment, 
  generateComments, 
  generateId 
} = require('../data/generator');

// In-memory storage
let comments = generateComments(50);

// GET all comments
router.get('/', (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedComments = comments.slice(startIndex, endIndex);
  
  return res.json({
    status: 'success',
    count: comments.length,
    data: paginatedComments,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(comments.length / limit)
  });
});

// GET a single comment by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const comment = comments.find(comment => comment.id === id);
  
  if (!comment) {
    return res.status(404).json({
      status: 'error',
      message: `Comment with ID ${id} not found`
    });
  }
  
  return res.json({
    status: 'success',
    data: comment
  });
});

// GET comments by post ID
router.get('/post/:postId', (req, res) => {
  const { postId } = req.params;
  const postComments = comments.filter(comment => comment.postId === postId);
  
  return res.json({
    status: 'success',
    count: postComments.length,
    data: postComments
  });
});

// GET comments by user ID
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userComments = comments.filter(comment => comment.userId === userId);
  
  return res.json({
    status: 'success',
    count: userComments.length,
    data: userComments
  });
});

// POST a new comment
router.post('/', (req, res) => {
  const newComment = { ...generateComment(), ...req.body, id: generateId() };
  comments.push(newComment);
  
  return res.status(201).json({
    status: 'success',
    message: 'Comment created successfully',
    data: newComment
  });
});

// PUT update a comment
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const commentIndex = comments.findIndex(comment => comment.id === id);
  
  if (commentIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: `Comment with ID ${id} not found`
    });
  }
  
  const updatedComment = { ...comments[commentIndex], ...req.body };
  comments[commentIndex] = updatedComment;
  
  return res.json({
    status: 'success',
    message: 'Comment updated successfully',
    data: updatedComment
  });
});

// PATCH update a comment partially
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const commentIndex = comments.findIndex(comment => comment.id === id);
  
  if (commentIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: `Comment with ID ${id} not found`
    });
  }
  
  const updatedComment = { ...comments[commentIndex], ...req.body };
  comments[commentIndex] = updatedComment;
  
  return res.json({
    status: 'success',
    message: 'Comment updated successfully',
    data: updatedComment
  });
});

// DELETE a comment
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const commentIndex = comments.findIndex(comment => comment.id === id);
  
  if (commentIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: `Comment with ID ${id} not found`
    });
  }
  
  const deletedComment = comments[commentIndex];
  comments = comments.filter(comment => comment.id !== id);
  
  return res.json({
    status: 'success',
    message: 'Comment deleted successfully',
    data: deletedComment
  });
});

// DELETE all comments and regenerate
router.delete('/', (req, res) => {
  const count = req.query.count || 50;
  comments = generateComments(count);
  
  return res.json({
    status: 'success',
    message: `All comments deleted and regenerated ${count} new comments`,
    count: comments.length
  });
});

module.exports = router; 