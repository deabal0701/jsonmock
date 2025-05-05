# JSON Mock API Server

A powerful and customizable mock API server for frontend development and testing.

## Features

- 🔄 RESTful API with GET, POST, PUT, PATCH, DELETE methods
- 🎭 Auto-generated mock data using Faker.js
- ✏️ User-defined custom endpoints with schema definition
- 📝 Request/response logging
- 📚 Swagger UI documentation
- 🎨 Beautiful and intuitive web interface

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/json-mock-api.git
cd json-mock-api
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

The server will be running at http://localhost:3000

## Usage

### Web Interface

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to access the web interface.

### API Endpoints

The following pre-built API endpoints are available:

#### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `PATCH /api/users/:id` - Partially update a user
- `DELETE /api/users/:id` - Delete a user
- `DELETE /api/users` - Delete all users and regenerate

#### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a specific post
- `GET /api/posts/user/:userId` - Get posts by user
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `PATCH /api/posts/:id` - Partially update a post
- `DELETE /api/posts/:id` - Delete a post
- `DELETE /api/posts` - Delete all posts and regenerate

#### Comments

- `GET /api/comments` - Get all comments
- `GET /api/comments/:id` - Get a specific comment
- `GET /api/comments/post/:postId` - Get comments by post
- `GET /api/comments/user/:userId` - Get comments by user
- `POST /api/comments` - Create a new comment
- `PUT /api/comments/:id` - Update a comment
- `PATCH /api/comments/:id` - Partially update a comment
- `DELETE /api/comments/:id` - Delete a comment
- `DELETE /api/comments` - Delete all comments and regenerate

### Custom Endpoints

You can create your own custom endpoints with a defined schema:

1. Make a POST request to `/api/custom/endpoints` with the following structure:

```json
{
  "path": "products",
  "schema": {
    "id": "id",
    "name": "word",
    "price": "number",
    "description": "paragraph",
    "image": "image",
    "createdAt": "date"
  },
  "methods": ["GET", "POST", "PUT", "DELETE"]
}
```

2. Your custom endpoint will be available at `/api/custom/products`

3. You can then use the endpoint with all the defined HTTP methods.

### Supported Data Types

- `id` - Unique identifier (UUID)
- `firstName` - First name
- `lastName` - Last name
- `fullName` - Full name
- `email` - Email address
- `phone` - Phone number
- `address` - Street address
- `city` - City name
- `country` - Country name
- `company` - Company name
- `word` - Random word
- `sentence` - Random sentence
- `paragraph` - Random paragraph
- `number` - Random number
- `boolean` - Random boolean
- `date` - Random date
- `image` - Random image URL
- `color` - Random color
- `url` - Random URL

## API Documentation

Swagger UI documentation is available at [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Faker.js](https://github.com/faker-js/faker) - For generating realistic mock data
- [Express](https://expressjs.com/) - The web framework used
- [Swagger UI](https://swagger.io/tools/swagger-ui/) - For API documentation 