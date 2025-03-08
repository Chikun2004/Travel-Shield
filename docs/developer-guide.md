# TravelShield Developer Guide

## Development Environment Setup

### Prerequisites

1. **Node.js and npm**
   ```bash
   # Check Node.js version
   node --version  # Should be >= 14.0.0
   npm --version   # Should be >= 6.0.0
   ```

2. **MongoDB**
   ```bash
   # Check MongoDB version
   mongod --version  # Should be >= 4.4.0
   ```

3. **Development Tools**
   - VS Code or your preferred IDE
   - Git
   - Postman or Insomnia for API testing
   - MongoDB Compass for database management

### Project Setup

1. **Clone and Install**
   ```bash
   # Clone repository
   git clone https://github.com/adityayadav71/travelshield.git
   cd travelshield

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   # Backend configuration
   cd backend
   cp .env.example .env

   # Frontend configuration
   cd ../frontend
   cp .env.example .env
   ```

3. **Database Setup**
   ```bash
   # Start MongoDB
   mongod

   # Seed database
   cd backend
   npm run seed
   ```

## Project Structure

```
travelshield/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── tests/          # Test files
│   └── server.js       # Entry point
├── frontend/
│   ├── public/         # Static files
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── store/      # Redux store
│   │   ├── utils/      # Utility functions
│   │   └── App.tsx     # Root component
│   └── package.json
└── docs/              # Documentation
```

## Development Workflow

### 1. Branch Management

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Create bugfix branch
git checkout -b fix/bug-description

# Create release branch
git checkout -b release/v1.0.0
```

### 2. Code Style

- Follow ESLint configuration
- Use Prettier for formatting
- Follow TypeScript best practices
- Write meaningful commit messages

### 3. Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Run specific test file
npm test -- path/to/test.js

# Generate coverage report
npm run test:coverage
```

### 4. Building

```bash
# Build frontend
cd frontend
npm run build

# Build backend (if using TypeScript)
cd backend
npm run build
```

## Key Components

### 1. Authentication

```javascript
// Example authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) throw new Error();
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};
```

### 2. Error Handling

```javascript
// Example error handler
const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      error: {
        code: err.errorCode,
        message: err.message
      }
    });
  }

  res.status(500).json({
    status: 'error',
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};
```

### 3. Database Operations

```javascript
// Example MongoDB model
const StaySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  price: {
    type: Number,
    required: true
  }
});

StaySchema.index({ location: '2dsphere' });
```

### 4. API Integration

```typescript
// Example API service
export const SafetyService = {
  getAlerts: async (params: SafetyAlertParams): Promise<SafetyAlert[]> => {
    const response = await api.get('/safety/alerts', { params });
    return response.data;
  },

  createAlert: async (data: CreateAlertData): Promise<SafetyAlert> => {
    const response = await api.post('/safety/alerts', data);
    return response.data;
  }
};
```

## Performance Optimization

### 1. Backend Optimization

- Use proper indexing
- Implement caching
- Optimize database queries
- Use compression middleware
- Implement rate limiting

### 2. Frontend Optimization

- Implement code splitting
- Use lazy loading
- Optimize images
- Implement caching
- Use performance monitoring

## Security Best Practices

1. **Input Validation**
   - Validate all inputs
   - Sanitize user data
   - Use parameterized queries

2. **Authentication & Authorization**
   - Implement proper session management
   - Use secure password hashing
   - Implement role-based access control

3. **Data Protection**
   - Use HTTPS
   - Implement proper CORS
   - Secure sensitive data
   - Regular security audits

## Deployment

### 1. Production Checklist

- Set proper environment variables
- Enable all security middleware
- Configure proper logging
- Set up monitoring
- Configure backup systems

### 2. Deployment Process

```bash
# Backend deployment
cd backend
npm run build
npm run start

# Frontend deployment
cd frontend
npm run build
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   ```bash
   # Check MongoDB status
   mongod --status
   
   # Check connection string
   echo $MONGODB_URI
   ```

2. **API Errors**
   - Check API logs
   - Verify request format
   - Check authentication token
   - Validate input data

3. **Build Issues**
   - Clear node_modules
   - Update dependencies
   - Check build logs

## Additional Resources

- [API Documentation](https://docs.travelshield.com/api)
- [Frontend Documentation](https://docs.travelshield.com/frontend)
- [Deployment Guide](https://docs.travelshield.com/deployment)
- [Security Guide](https://docs.travelshield.com/security)
- [Contributing Guidelines](https://github.com/adityayadav71/travelshield/blob/main/CONTRIBUTING.md)

## Support

- Create issues on [GitHub](https://github.com/adityayadav71/travelshield/issues)
- Join our [Discord community](https://discord.gg/travelshield)
- Check our [Stack Overflow tag](https://stackoverflow.com/questions/tagged/travelshield)
- Contact developer support at dev-support@travelshield.com
