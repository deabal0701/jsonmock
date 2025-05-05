const express = require('express');
const router = express.Router();
const { 
  generateUser, 
  generateUsers, 
  generateId 
} = require('../data/generator');

// 기존 ID를 8자리 형식으로 변환하는 함수
function convertToShortId(item) {
  if (item.id && typeof item.id === 'string') {
    const newItem = { ...item };
    // 기존 ID의 첫 8자리만 사용
    newItem.id = item.id.substring(0, 8);
    return newItem;
  }
  return item;
}

// 초기 사용자 데이터 생성 및 ID 형식 변환
let users = generateUsers(20).map(convertToShortId);

// GET all users
router.get('/', (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedUsers = users.slice(startIndex, endIndex);
  
  return res.json({
    status: 'success',
    count: users.length,
    data: paginatedUsers,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(users.length / limit)
  });
});

// GET a single user by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(user => user.id === id);
  
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: `User with ID ${id} not found`
    });
  }
  
  return res.json({
    status: 'success',
    data: user
  });
});

// POST a new user
router.post('/', (req, res) => {
  const newUser = { ...generateUser(), ...req.body, id: generateId() };
  users.push(newUser);
  
  return res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: newUser
  });
});

// PUT update a user
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: `User with ID ${id} not found`
    });
  }
  
  const updatedUser = { ...users[userIndex], ...req.body };
  users[userIndex] = updatedUser;
  
  return res.json({
    status: 'success',
    message: 'User updated successfully',
    data: updatedUser
  });
});

// PATCH update a user partially
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: `User with ID ${id} not found`
    });
  }
  
  const updatedUser = { ...users[userIndex], ...req.body };
  users[userIndex] = updatedUser;
  
  return res.json({
    status: 'success',
    message: 'User updated successfully',
    data: updatedUser
  });
});

// DELETE a user
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: `User with ID ${id} not found`
    });
  }
  
  const deletedUser = users[userIndex];
  users = users.filter(user => user.id !== id);
  
  return res.json({
    status: 'success',
    message: 'User deleted successfully',
    data: deletedUser
  });
});

// DELETE all users and regenerate
router.delete('/', (req, res) => {
  const count = req.query.count || 20;
  users = generateUsers(count);
  
  return res.json({
    status: 'success',
    message: `All users deleted and regenerated ${count} new users`,
    count: users.length
  });
});

module.exports = router; 