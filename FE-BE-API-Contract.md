# Frontend-Backend API Contract for KnowledgeBox Application

## Overview
This document describes the API contract between the Angular frontend and the backend services for the KnowledgeBox application. The frontend expects specific endpoints and data structures to manage knowledge boxes effectively.

## Base URL Configuration
The frontend is configured to use the following base URL:
```
https://knowledge-box-api.lemonhill-9a1917eb.westeurope.azurecontainerapps.io
```

## Authentication
All API endpoints require authentication via JWT tokens. The frontend includes the JWT token in the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

## Data Models

### KnowledgeBox Entity
```typescript
interface KnowledgeBox {
  id: string;                    // Unique identifier
  title: string;                 // Knowledge box title
  topic: string;                 // Main topic/subject
  content: string;               // Main content (markdown/text)
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
  userId: string;                // Owner user ID
  isPublic: boolean;             // Visibility flag
  tags: string[];                // Array of tags
  collaborators?: string[];      // Optional: Array of collaborator user IDs
}
```

### Request/Response Models
```typescript
interface CreateKnowledgeBoxRequest {
  title: string;
  topic: string;
  content?: string;              // Optional, can be empty initially
  isPublic?: boolean;            // Optional, defaults to false
  tags?: string[];               // Optional, defaults to empty array
}

interface UpdateKnowledgeBoxRequest {
  id: string;
  title?: string;                // Optional partial updates
  topic?: string;
  content?: string;
  isPublic?: boolean;
  tags?: string[];
}

interface KnowledgeBoxResponse {
  success: boolean;
  message?: string;              // Error message or success details
  knowledgeBox?: KnowledgeBox;   // The knowledge box data
}

interface KnowledgeBoxListResponse {
  success: boolean;
  message?: string;
  knowledgeBoxes?: KnowledgeBox[];
  totalCount?: number;           // Total number of knowledge boxes
}

interface DeleteKnowledgeBoxResponse {
  success: boolean;
  message?: string;
}
```

## API Endpoints

### 1. Get All Knowledge Boxes
**Endpoint:** `GET /knowledgeboxes`
**Authentication:** Required
**Description:** Retrieve all knowledge boxes for the authenticated user

**Response:**
```json
{
  "success": true,
  "knowledgeBoxes": [
    {
      "id": "uuid-1",
      "title": "PLC Programming Basics",
      "topic": "Industrial Automation",
      "content": "Content here...",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "userId": "user-uuid",
      "isPublic": false,
      "tags": ["programming", "automation", "plc"]
    }
  ],
  "totalCount": 1
}
```

### 2. Get Knowledge Box by ID
**Endpoint:** `GET /knowledgeboxes/{id}`
**Authentication:** Required
**Description:** Retrieve a specific knowledge box by its ID

**Response:**
```json
{
  "success": true,
  "knowledgeBox": {
    "id": "uuid-1",
    "title": "PLC Programming Basics",
    "topic": "Industrial Automation",
    "content": "Detailed content...",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "userId": "user-uuid",
    "isPublic": false,
    "tags": ["programming", "automation", "plc"]
  }
}
```

### 3. Create Knowledge Box
**Endpoint:** `POST /knowledgeboxes`
**Authentication:** Required
**Description:** Create a new knowledge box

**Request Body:**
```json
{
  "title": "Machine Learning Fundamentals",
  "topic": "Artificial Intelligence",
  "content": "Initial content...",
  "isPublic": false,
  "tags": ["machine-learning", "ai", "python"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Knowledge box created successfully",
  "knowledgeBox": {
    "id": "uuid-2",
    "title": "Machine Learning Fundamentals",
    "topic": "Artificial Intelligence",
    "content": "Initial content...",
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z",
    "userId": "user-uuid",
    "isPublic": false,
    "tags": ["machine-learning", "ai", "python"]
  }
}
```

### 4. Update Knowledge Box
**Endpoint:** `PUT /knowledgeboxes/{id}`
**Authentication:** Required
**Description:** Update an existing knowledge box

**Request Body:**
```json
{
  "id": "uuid-1",
  "title": "Advanced PLC Programming",
  "content": "Updated content with more details...",
  "tags": ["programming", "automation", "plc", "advanced"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Knowledge box updated successfully",
  "knowledgeBox": {
    "id": "uuid-1",
    "title": "Advanced PLC Programming",
    "topic": "Industrial Automation",
    "content": "Updated content with more details...",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:30:00Z",
    "userId": "user-uuid",
    "isPublic": false,
    "tags": ["programming", "automation", "plc", "advanced"]
  }
}
```

### 5. Delete Knowledge Box
**Endpoint:** `DELETE /knowledgeboxes/{id}`
**Authentication:** Required
**Description:** Delete a knowledge box

**Response:**
```json
{
  "success": true,
  "message": "Knowledge box deleted successfully"
}
```

### 6. Search Knowledge Boxes
**Endpoint:** `GET /knowledgeboxes/search`
**Authentication:** Required
**Description:** Search knowledge boxes by query string and/or tags

**Query Parameters:**
- `query` (string): Search term to match against title, topic, and content
- `tags` (string): Comma-separated list of tags to filter by

**Example:** `GET /knowledgeboxes/search?query=programming&tags=automation,plc`

**Response:**
```json
{
  "success": true,
  "knowledgeBoxes": [
    {
      "id": "uuid-1",
      "title": "PLC Programming Basics",
      "topic": "Industrial Automation",
      "content": "Content here...",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "userId": "user-uuid",
      "isPublic": false,
      "tags": ["programming", "automation", "plc"]
    }
  ],
  "totalCount": 1
}
```

### 7. Get Public Knowledge Boxes
**Endpoint:** `GET /knowledgeboxes/public`
**Authentication:** Required
**Description:** Retrieve all public knowledge boxes (for browsing/discovery)

**Response:**
```json
{
  "success": true,
  "knowledgeBoxes": [
    {
      "id": "uuid-3",
      "title": "Introduction to React",
      "topic": "Web Development",
      "content": "Public content...",
      "createdAt": "2024-01-15T09:00:00Z",
      "updatedAt": "2024-01-15T09:00:00Z",
      "userId": "another-user-uuid",
      "isPublic": true,
      "tags": ["react", "javascript", "frontend"]
    }
  ],
  "totalCount": 1
}
```

## Error Handling

All endpoints should return appropriate HTTP status codes:
- `200 OK`: Successful operation
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or invalid
- `403 Forbidden`: User doesn't have permission
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses should follow this format:
```json
{
  "success": false,
  "message": "Detailed error message",
  "error": "ERROR_CODE" // Optional error code
}
```

## Business Rules

1. **Ownership**: Users can only modify/delete their own knowledge boxes
2. **Public Access**: Public knowledge boxes are readable by all authenticated users
3. **Search Scope**: Search should include only user's own knowledge boxes and public ones
4. **Content Validation**: Title and topic are required fields
5. **Tags**: Tags should be case-insensitive and trimmed
6. **Timestamps**: All timestamps should be in ISO 8601 format (UTC)

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: Users should only access their own knowledge boxes (except public ones)
3. **Input Validation**: All user inputs should be validated and sanitized
4. **Rate Limiting**: Consider implementing rate limiting for API endpoints
5. **CORS**: Configure appropriate CORS headers for the frontend domain

## Performance Recommendations

1. **Pagination**: Consider implementing pagination for large result sets
2. **Caching**: Implement caching for frequently accessed public knowledge boxes
3. **Indexing**: Create database indices on frequently queried fields (title, topic, tags, userId)
4. **Lazy Loading**: Support for loading content only when needed

## Future Enhancements

1. **Collaboration**: Support for sharing knowledge boxes with specific users
2. **Versioning**: Track changes and maintain version history
3. **AI Integration**: Endpoints for AI-powered content suggestions
4. **File Attachments**: Support for uploading and attaching files
5. **Comments**: Allow comments on knowledge boxes
6. **Categories**: Hierarchical categorization system

## Testing Requirements

The backend should provide test data and support for:
1. Unit tests for all endpoints
2. Integration tests for complex workflows
3. Load testing for performance validation
4. Security testing for authentication/authorization

This API contract ensures a robust and scalable foundation for the KnowledgeBox application, supporting the core functionality while providing flexibility for future enhancements.