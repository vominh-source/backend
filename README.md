# User Management Backend API

A RESTful API built with Express.js, TypeScript, and DynamoDB for user management with API key authentication.

## Features

- **TypeScript**: Full TypeScript implementation for type safety
- **Express.js**: Fast and minimalist web framework
- **DynamoDB**: AWS DynamoDB for data persistence (free tier compatible)
- **API Key Authentication**: Secure endpoints with API key validation
- **Input Validation**: Joi schema validation for request data
- **Error Handling**: Comprehensive error handling and responses
- **CORS Support**: Cross-origin resource sharing enabled
- **Security**: Helmet.js for security headers

## Prerequisites

- Node.js 14.x or higher
- npm or yarn
- AWS Account with DynamoDB access (free tier)
- Git

## Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` file in your root folder
   
   Then edit `.env` with your actual values:
   ```env
   AWS_REGION=ap-southeast-2
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   DYNAMODB_TABLE_NAME=users
   PORT=3000
   API_KEY=your_secret_api_key_here
   ```

4. **Build the project**

   ```bash
   npm run build
   ```

5. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

All endpoints require the `x-api-key` header for authentication.

### Base URL

```
http://localhost:3000/api
```

### Authentication

Include the API key in the request header:

```
x-api-key: your_secret_api_key_here
```

### Endpoints

#### 1. Search Users (or Get All Users)

```http
GET /api/users/search
GET /api/users/search?name={searchTerm}
```

**Parameters:**

- `name` (query, optional): Search term for username or email (case-insensitive). If not provided, returns all users.

**Example Request (Search):**

```bash
curl -X GET "http://localhost:3000/api/users/search?name=john" \
  -H "x-api-key: your_secret_api_key_here"
```

**Example Request (Get All):**

```bash
curl -X GET "http://localhost:3000/api/users/search" \
  -H "x-api-key: your_secret_api_key_here"
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "username": "john.doe",
      "email": "john.doe@email.com",
      "birthdate": "1991-04-21"
    },
    {
      "id": "2",
      "username": "john.smith",
      "email": "john.smith@email.com",
      "birthdate": "1994-09-07"
    }
  ],
  "message": "Found 2 users matching \"john\""
}
```

#### 2. Update Users

```http
POST /api/users/update
```

**Request Body:**

```json
[
  {
    "id": 1,
    "username": "john.doe.updated",
    "email": "john.doe.new@email.com"
  },
  {
    "id": 2,
    "birthdate": "1994-10-07"
  }
]
```

**Example Request:**

```bash
curl -X POST "http://localhost:3000/api/users/update" \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_secret_api_key_here" \
  -d '[
    {
      "id": 1,
      "username": "john.doe.updated",
      "email": "john.doe.new@email.com"
    }
  ]'
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "john.doe.updated",
      "email": "john.doe.new@email.com",
      "birthdate": "1991-04-21"
    }
  ],
  "message": "Successfully updated 1 users"
}
```

## Database Schema

### Users Table (DynamoDB)

| Field     | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| id        | Number | Primary key (integer)        |
| username  | String | User's username              |
| email     | String | User's email address         |
| birthdate | String | ISO date string (YYYY-MM-DD) |

### Existing Data

The API connects to existing data in your AWS DynamoDB table with the following format:

```json
[
  {
    "id": 1,
    "username": "john.doe",
    "email": "john.doe@email.com",
    "birthdate": "1991-04-21"
  },
  {
    "id": 2,
    "username": "john.smith",
    "email": "john.smith@email.com",
    "birthdate": "1994-09-07"
  },
  {
    "id": 3,
    "username": "jane.doe",
    "email": "jane.doe@email.com",
    "birthdate": "1988-12-15"
  },
  {
    "id": 4,
    "username": "alice.johnson",
    "email": "alice.johnson@email.com",
    "birthdate": "1992-03-28"
  },
  {
    "id": 5,
    "username": "bob.wilson",
    "email": "bob.wilson@email.com",
    "birthdate": "1985-07-11"
  }
]
```

## Scripts

- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run dev` - Start development server with hot reload

## Security

- **API Key Authentication**: All endpoints require a valid API key
- **Input Validation**: Joi schemas validate all input data
- **Helmet.js**: Security headers for Express.js
- **CORS**: Configured for cross-origin requests
- **Error Handling**: Sensitive information is not exposed in error responses

## Project Structure

```
src/
├── config/
│   ├── index.ts              # Configuration settings
│   └── database.ts           # DynamoDB configuration
├── controllers/
│   └── userController.ts     # User route handlers
├── middleware/
│   └── auth.ts               # API key authentication
├── routes/
│   ├── index.ts              # Main router
│   └── userRoutes.ts         # User routes
├── services/
│   └── userService.ts        # Business logic layer
├── types/
│   └── index.ts              # TypeScript type definitions
├── validation/
│   └── schemas.ts            # Joi validation schemas
└── index.ts                  # Application entry point
```

## Deployment

### Local Development

1. Follow the installation steps above
2. Ensure your AWS credentials are configured
3. Run `npm run dev` for development mode

### Production

1. Set up environment variables on your hosting platform
2. Run `npm run build` to compile TypeScript
3. Run `npm start` to start the production server

## Testing the API

### Using curl

1. **Search for users:**

   ```bash
   curl -X GET "http://localhost:3000/api/users/search?name=john" \
     -H "x-api-key: your_secret_api_key_here"
   ```

2. **Update users:**
   ```bash
   curl -X POST "http://localhost:3000/api/users/update" \
     -H "Content-Type: application/json" \
     -H "x-api-key: your_secret_api_key_here" \
     -d '[{"id": 1, "username": "john.doe.updated"}]'
   ```

### Using Postman

1. Import the API endpoints
2. Set the `x-api-key` header in all requests
3. Use the provided examples as templates

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid API key)
- `404` - Not Found (user not found)
- `500` - Internal Server Error

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
