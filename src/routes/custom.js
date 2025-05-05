const express = require('express');
const router = express.Router();
const { generateCustomData } = require('../data/generator');

// Store custom endpoints and their schemas
const customEndpoints = {};

// GET all custom endpoints
router.get('/', (req, res) => {
  const endpoints = Object.keys(customEndpoints).map(path => ({
    path,
    schema: customEndpoints[path].schema,
    methods: customEndpoints[path].methods
  }));
  
  return res.json({
    status: 'success',
    count: endpoints.length,
    data: endpoints
  });
});

// Create a new custom endpoint
router.post('/endpoints', (req, res) => {
  const { path, schema, methods } = req.body;
  
  if (!path || !schema) {
    return res.status(400).json({
      status: 'error',
      message: 'Path and schema are required'
    });
  }
  
  // Normalize the path
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Default methods if not provided
  const allowedMethods = methods || ['GET', 'POST', 'PUT', 'DELETE'];
  
  // Create the custom endpoint
  customEndpoints[normalizedPath] = {
    schema,
    methods: allowedMethods,
    data: []
  };
  
  return res.status(201).json({
    status: 'success',
    message: `Custom endpoint created at /api/custom/${normalizedPath}`,
    data: {
      path: normalizedPath,
      schema,
      methods: allowedMethods
    }
  });
});

// Delete a custom endpoint
router.delete('/endpoints/:path', (req, res) => {
  const { path } = req.params;
  
  if (!customEndpoints[path]) {
    return res.status(404).json({
      status: 'error',
      message: `Custom endpoint ${path} not found`
    });
  }
  
  const deletedEndpoint = customEndpoints[path];
  delete customEndpoints[path];
  
  return res.json({
    status: 'success',
    message: `Custom endpoint ${path} deleted`,
    data: deletedEndpoint
  });
});

// Handle dynamic routes for custom endpoints
router.all('/:path*', (req, res) => {
  const fullPath = req.params.path + (req.params[0] || '');
  const segments = fullPath.split('/').filter(Boolean);
  const mainPath = segments[0];
  
  if (!customEndpoints[mainPath]) {
    return res.status(404).json({
      status: 'error',
      message: `Custom endpoint ${mainPath} not found`
    });
  }
  
  const endpoint = customEndpoints[mainPath];
  const method = req.method;
  
  // Check if the method is allowed for this endpoint
  if (!endpoint.methods.includes(method)) {
    return res.status(405).json({
      status: 'error',
      message: `Method ${method} not allowed for this endpoint`,
      allowedMethods: endpoint.methods
    });
  }
  
  // Generate fake data based on the schema
  const responseCount = req.query.count || 1;
  let response;
  
  switch (method) {
    case 'GET':
      // Return all items or a single item by ID
      if (segments.length > 1) {
        const id = segments[1];
        const item = endpoint.data.find(item => item.id === id);
        
        if (!item) {
          return res.status(404).json({
            status: 'error',
            message: `Item with ID ${id} not found`
          });
        }
        
        response = {
          status: 'success',
          data: item
        };
      } else {
        // Return generated data if no data exists yet
        if (endpoint.data.length === 0) {
          response = {
            status: 'success',
            message: 'Generated mock data',
            data: Array.from({ length: responseCount }, () => generateCustomData(endpoint.schema))
          };
        } else {
          response = {
            status: 'success',
            count: endpoint.data.length,
            data: endpoint.data
          };
        }
      }
      break;
      
    case 'POST':
      // Create a new item
      const newItem = { ...generateCustomData(endpoint.schema), ...req.body };
      endpoint.data.push(newItem);
      
      response = {
        status: 'success',
        message: 'Item created successfully',
        data: newItem
      };
      break;
      
    case 'PUT':
    case 'PATCH':
      // Update an item
      if (segments.length < 2) {
        return res.status(400).json({
          status: 'error',
          message: 'Item ID is required for update'
        });
      }
      
      const updateId = segments[1];
      const itemIndex = endpoint.data.findIndex(item => item.id === updateId);
      
      if (itemIndex === -1) {
        return res.status(404).json({
          status: 'error',
          message: `Item with ID ${updateId} not found`
        });
      }
      
      const updatedItem = { ...endpoint.data[itemIndex], ...req.body };
      endpoint.data[itemIndex] = updatedItem;
      
      response = {
        status: 'success',
        message: 'Item updated successfully',
        data: updatedItem
      };
      break;
      
    case 'DELETE':
      // Delete an item or all items
      if (segments.length < 2) {
        // Delete all items
        endpoint.data = [];
        
        response = {
          status: 'success',
          message: 'All items deleted'
        };
      } else {
        // Delete a specific item
        const deleteId = segments[1];
        const itemToDelete = endpoint.data.find(item => item.id === deleteId);
        
        if (!itemToDelete) {
          return res.status(404).json({
            status: 'error',
            message: `Item with ID ${deleteId} not found`
          });
        }
        
        endpoint.data = endpoint.data.filter(item => item.id !== deleteId);
        
        response = {
          status: 'success',
          message: 'Item deleted successfully',
          data: itemToDelete
        };
      }
      break;
      
    default:
      response = {
        status: 'error',
        message: `Method ${method} not implemented`
      };
  }
  
  return res.json(response);
});

module.exports = router; 