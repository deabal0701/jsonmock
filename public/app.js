document.addEventListener('DOMContentLoaded', () => {
  // Element references
  const navLinks = document.querySelectorAll('.nav a');
  const sections = document.querySelectorAll('.section');
  const schemaFields = document.getElementById('schema-fields');
  const addFieldBtn = document.getElementById('add-field-btn');
  const customEndpointForm = document.getElementById('custom-endpoint-form');
  const schemaPreview = document.getElementById('schema-preview');
  const endpointResult = document.getElementById('endpoint-result');
  const createdEndpointUrl = document.getElementById('created-endpoint-url');
  const testEndpointBtn = document.getElementById('test-endpoint-btn');
  const copyUrlBtn = document.getElementById('copy-url-btn');
  const requestModal = document.getElementById('request-modal');
  const closeModalBtn = document.querySelector('.close-btn');
  const requestTitle = document.getElementById('request-title');
  const requestMethod = document.getElementById('request-method');
  const requestUrl = document.getElementById('request-url');
  const requestBodyContainer = document.getElementById('request-body-container');
  const requestBody = document.getElementById('request-body');
  const sendRequestBtn = document.getElementById('send-request-btn');
  const responseData = document.getElementById('response-data');
  const responseStatus = document.getElementById('response-status');
  const responseTime = document.getElementById('response-time');
  const copyResponseBtn = document.getElementById('copy-response-btn');
  const customEndpointsList = document.getElementById('custom-endpoints-list');
  const toast = document.getElementById('toast');
  const toastMessage = document.querySelector('.toast-message');
  const tryButtons = document.querySelectorAll('.try-btn');
  const sectionNavLinks = document.querySelectorAll('a[href^="#"]:not([href^="http"])');

  // Function to handle section navigation
  const navigateToSection = (e) => {
    if (e.currentTarget.classList.contains('nav-no-action')) {
      return; // Skip navigation for links with nav-no-action class
    }
    
    e.preventDefault();
    const target = e.currentTarget.getAttribute('href').substring(1);
    
    // Update active nav link in the main navigation
    navLinks.forEach(navLink => navLink.classList.remove('active'));
    navLinks.forEach(navLink => {
      if (navLink.getAttribute('href') === `#${target}`) {
        navLink.classList.add('active');
      }
    });
    
    // Show target section
    sections.forEach(section => {
      section.classList.remove('active');
      if (section.id === target) {
        section.classList.add('active');
      }
    });
  };

  // Handle navigation for all links with href starting with #
  sectionNavLinks.forEach(link => {
    link.addEventListener('click', navigateToSection);
  });

  // Try endpoint buttons
  tryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const url = button.getAttribute('data-url');
      const method = button.getAttribute('data-method');
      openRequestModal(url, method);
    });
  });

  // Add field button
  addFieldBtn.addEventListener('click', () => {
    addSchemaField();
  });

  // Handle schema field changes
  schemaFields.addEventListener('change', () => {
    updateSchemaPreview();
  });
  schemaFields.addEventListener('input', () => {
    updateSchemaPreview();
  });

  // Handle remove field buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-field-btn') && !e.target.disabled) {
      e.target.parentElement.remove();
      updateSchemaPreview();
    }
  });

  // Custom endpoint form submission
  customEndpointForm.addEventListener('submit', (e) => {
    e.preventDefault();
    createCustomEndpoint();
  });

  // Test endpoint button
  testEndpointBtn.addEventListener('click', () => {
    const url = createdEndpointUrl.textContent;
    openRequestModal(url, 'GET');
  });

  // Copy URL button
  copyUrlBtn.addEventListener('click', () => {
    copyToClipboard(createdEndpointUrl.textContent);
    showToast('URL copied to clipboard!');
  });

  // Close modal button
  closeModalBtn.addEventListener('click', () => {
    requestModal.classList.remove('show');
  });

  // Click outside modal to close
  requestModal.addEventListener('click', (e) => {
    if (e.target === requestModal) {
      requestModal.classList.remove('show');
    }
  });

  // Send request button
  sendRequestBtn.addEventListener('click', () => {
    sendApiRequest();
  });

  // Copy response button
  copyResponseBtn.addEventListener('click', () => {
    copyToClipboard(responseData.textContent);
    showToast('Response copied to clipboard!');
  });

  // Add schema field function
  function addSchemaField() {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'schema-field';
    
    const fieldName = document.createElement('input');
    fieldName.type = 'text';
    fieldName.className = 'field-name';
    fieldName.placeholder = 'field name';
    
    const fieldType = document.createElement('select');
    fieldType.className = 'field-type';
    
    const types = [
      { value: 'id', text: 'ID' },
      { value: 'firstName', text: 'First Name' },
      { value: 'lastName', text: 'Last Name' },
      { value: 'fullName', text: 'Full Name' },
      { value: 'email', text: 'Email' },
      { value: 'phone', text: 'Phone' },
      { value: 'address', text: 'Address' },
      { value: 'city', text: 'City' },
      { value: 'country', text: 'Country' },
      { value: 'company', text: 'Company' },
      { value: 'word', text: 'Word' },
      { value: 'sentence', text: 'Sentence' },
      { value: 'paragraph', text: 'Paragraph' },
      { value: 'number', text: 'Number' },
      { value: 'boolean', text: 'Boolean' },
      { value: 'date', text: 'Date' },
      { value: 'image', text: 'Image URL' },
      { value: 'color', text: 'Color' },
      { value: 'url', text: 'URL' }
    ];
    
    types.forEach(type => {
      const option = document.createElement('option');
      option.value = type.value;
      option.textContent = type.text;
      fieldType.appendChild(option);
    });
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-field-btn';
    removeBtn.textContent = '×';
    
    fieldDiv.appendChild(fieldName);
    fieldDiv.appendChild(fieldType);
    fieldDiv.appendChild(removeBtn);
    
    schemaFields.appendChild(fieldDiv);
    
    // Update the preview after adding a field
    updateSchemaPreview();
  }

  // Update schema preview function
  function updateSchemaPreview() {
    const schema = {};
    const fields = schemaFields.querySelectorAll('.schema-field');
    
    fields.forEach(field => {
      const name = field.querySelector('.field-name').value || 'field';
      const type = field.querySelector('.field-type').value;
      schema[name] = type;
    });
    
    // Generate preview data
    const previewData = generatePreviewData(schema);
    schemaPreview.textContent = JSON.stringify(previewData, null, 2);
  }

  // Generate preview data function
  function generatePreviewData(schema) {
    const previewData = {};
    
    for (const [key, type] of Object.entries(schema)) {
      switch (type) {
        case 'id':
          previewData[key] = generateMockId();
          break;
        case 'firstName':
          previewData[key] = 'John';
          break;
        case 'lastName':
          previewData[key] = 'Doe';
          break;
        case 'fullName':
          previewData[key] = 'John Doe';
          break;
        case 'email':
          previewData[key] = 'john.doe@example.com';
          break;
        case 'phone':
          previewData[key] = '(555) 123-4567';
          break;
        case 'address':
          previewData[key] = '123 Main St';
          break;
        case 'city':
          previewData[key] = 'New York';
          break;
        case 'country':
          previewData[key] = 'USA';
          break;
        case 'company':
          previewData[key] = 'Acme Inc';
          break;
        case 'word':
          previewData[key] = 'Product';
          break;
        case 'sentence':
          previewData[key] = 'This is a sample product description.';
          break;
        case 'paragraph':
          previewData[key] = 'This is a description of the product with multiple sentences. It can contain various details about features and specifications.';
          break;
        case 'number':
          previewData[key] = 42;
          break;
        case 'boolean':
          previewData[key] = true;
          break;
        case 'date':
          previewData[key] = new Date().toISOString();
          break;
        case 'image':
          previewData[key] = 'https://example.com/image.jpg';
          break;
        case 'color':
          previewData[key] = '#3B82F6';
          break;
        case 'url':
          previewData[key] = 'https://example.com';
          break;
        default:
          previewData[key] = 'Sample value';
      }
    }
    
    return previewData;
  }

  // Generate a mock ID
  function generateMockId() {
    const segments = [
      Math.random().toString(16).slice(2, 10),
      Math.random().toString(16).slice(2, 6),
      Math.random().toString(16).slice(2, 6),
      Math.random().toString(16).slice(2, 6),
      Math.random().toString(16).slice(2, 14)
    ];
    
    return segments.join('-');
  }

  // Create custom endpoint function
  function createCustomEndpoint() {
    const endpointPath = document.getElementById('endpoint-path').value.trim();
    
    if (!endpointPath) {
      showToast('Please enter an endpoint path', 'error');
      return;
    }
    
    const methodCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
    const methods = Array.from(methodCheckboxes).map(cb => cb.value);
    
    if (methods.length === 0) {
      showToast('Please select at least one HTTP method', 'error');
      return;
    }
    
    // Create schema object
    const schema = {};
    const fields = schemaFields.querySelectorAll('.schema-field');
    
    fields.forEach(field => {
      const name = field.querySelector('.field-name').value.trim();
      const type = field.querySelector('.field-type').value;
      
      if (name) {
        schema[name] = type;
      }
    });
    
    if (Object.keys(schema).length === 0) {
      showToast('Please define at least one field in the schema', 'error');
      return;
    }
    
    // Prepare the request data
    const requestData = {
      path: endpointPath,
      schema: schema,
      methods: methods
    };
    
    // Send the request to create the endpoint
    fetch('/api/custom/endpoints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        // Show success message
        endpointResult.classList.remove('hidden');
        createdEndpointUrl.textContent = `http://localhost:3000/api/custom/${endpointPath}`;
        
        // Add to custom endpoints list
        updateCustomEndpointsList();
        
        showToast('Custom endpoint created successfully!');
      } else {
        throw new Error(data.message || 'Failed to create endpoint');
      }
    })
    .catch(error => {
      showToast(error.message || 'An error occurred', 'error');
    });
  }

  // Update custom endpoints list
  function updateCustomEndpointsList() {
    fetch('/api/custom')
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success' && data.data.length > 0) {
          customEndpointsList.innerHTML = '';
          
          data.data.forEach(endpoint => {
            const endpointItem = document.createElement('div');
            endpointItem.className = 'custom-endpoint-item';
            
            const endpointPath = document.createElement('div');
            endpointPath.className = 'endpoint-path';
            endpointPath.textContent = `/api/custom/${endpoint.path}`;
            
            const endpointInfo = document.createElement('div');
            endpointInfo.className = 'endpoint-info';
            
            const endpointMethods = document.createElement('div');
            endpointMethods.className = 'endpoint-methods';
            
            endpoint.methods.forEach(method => {
              const methodTag = document.createElement('span');
              methodTag.className = `endpoint-method-tag method ${method.toLowerCase()}`;
              methodTag.textContent = method;
              endpointMethods.appendChild(methodTag);
            });
            
            const tryButton = document.createElement('button');
            tryButton.className = 'try-btn';
            tryButton.textContent = 'Try it';
            tryButton.setAttribute('data-url', `/api/custom/${endpoint.path}`);
            tryButton.setAttribute('data-method', 'GET');
            tryButton.addEventListener('click', () => {
              openRequestModal(`/api/custom/${endpoint.path}`, 'GET');
            });
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'try-btn';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
              deleteCustomEndpoint(endpoint.path);
            });
            
            endpointInfo.appendChild(endpointMethods);
            endpointInfo.appendChild(tryButton);
            endpointInfo.appendChild(deleteButton);
            
            endpointItem.appendChild(endpointPath);
            endpointItem.appendChild(endpointInfo);
            
            customEndpointsList.appendChild(endpointItem);
          });
        } else {
          customEndpointsList.innerHTML = '<p class="empty-state">No custom endpoints created yet</p>';
        }
      })
      .catch(error => {
        customEndpointsList.innerHTML = '<p class="empty-state">Failed to load custom endpoints</p>';
      });
  }

  // Delete custom endpoint
  function deleteCustomEndpoint(path) {
    if (confirm(`Are you sure you want to delete the endpoint /api/custom/${path}?`)) {
      fetch(`/api/custom/endpoints/${path}`, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            updateCustomEndpointsList();
            showToast('Endpoint deleted successfully');
          } else {
            throw new Error(data.message || 'Failed to delete endpoint');
          }
        })
        .catch(error => {
          showToast(error.message || 'An error occurred', 'error');
        });
    }
  }

  // Open request modal
  function openRequestModal(url, method) {
    requestTitle.textContent = `${method} Request`;
    requestMethod.textContent = method;
    requestMethod.className = `method ${method.toLowerCase()}`;
    requestUrl.value = url;
    
    // Show/hide request body based on method
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      requestBodyContainer.style.display = 'block';
      
      // Default request body examples based on endpoint
      if (url.includes('/users')) {
        requestBody.value = JSON.stringify({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com'
        }, null, 2);
      } else if (url.includes('/posts')) {
        requestBody.value = JSON.stringify({
          title: 'New Post Title',
          body: 'This is the content of the post.'
        }, null, 2);
      } else if (url.includes('/comments')) {
        requestBody.value = JSON.stringify({
          body: 'This is a comment on the post.'
        }, null, 2);
      } else {
        requestBody.value = JSON.stringify({
          // Empty object for custom endpoints
        }, null, 2);
      }
    } else {
      requestBodyContainer.style.display = 'none';
    }
    
    // Clear previous response
    responseData.textContent = '';
    responseStatus.textContent = '';
    responseStatus.className = '';
    responseTime.textContent = '';
    
    requestModal.classList.add('show');
  }

  // Send API request
  function sendApiRequest() {
    const method = requestMethod.textContent;
    const url = requestUrl.value;
    
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    // Add request body for POST, PUT, PATCH
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      try {
        const bodyData = JSON.parse(requestBody.value);
        options.body = JSON.stringify(bodyData);
      } catch (e) {
        showToast('Invalid JSON in request body', 'error');
        return;
      }
    }
    
    // Send the request
    const startTime = Date.now();
    
    fetch(url, options)
      .then(response => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        responseTime.textContent = `${duration}ms`;
        
        if (response.ok) {
          responseStatus.textContent = `${response.status} ${response.statusText}`;
          responseStatus.className = 'success';
        } else {
          responseStatus.textContent = `${response.status} ${response.statusText}`;
          responseStatus.className = 'error';
        }
        
        return response.json();
      })
      .then(data => {
        responseData.textContent = JSON.stringify(data, null, 2);
      })
      .catch(error => {
        responseStatus.textContent = 'Error';
        responseStatus.className = 'error';
        responseData.textContent = `Failed to send request: ${error.message}`;
      });
  }

  // Copy to clipboard function
  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  // Show toast message
  function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      toast.className = 'toast';
    }, 3000);
  }

  // Initial setup
  updateSchemaPreview();
  updateCustomEndpointsList();
}); 