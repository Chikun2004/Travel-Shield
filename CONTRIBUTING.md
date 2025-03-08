# Contributing to TravelShield

First off, thank you for considering contributing to TravelShield! It's people like you that make TravelShield such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by the TravelShield Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow the JavaScript and React styleguides
* End files with a newline
* Avoid platform-dependent code

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### JavaScript Styleguide

* Use semicolons
* 2 spaces for indentation
* Prefer const over let
* Use meaningful variable names
* Use async/await over promises
* Add comments for complex logic

### React Styleguide

* Use functional components with hooks
* Use PropTypes for type checking
* Keep components small and focused
* Use meaningful component names
* Follow file naming conventions

## Backend Development Guidelines

### Environment Setup

1. **Prerequisites**
   - Node.js (v14.0.0 or higher)
   - MongoDB (v4.4 or higher)
   - npm or yarn package manager

2. **Initial Setup**
   ```bash
   cd backend
   npm install
   cp .env.development .env
   ```

3. **Environment Variables**
   - Update `.env` with your local configuration
   - Never commit `.env` files to version control
   - Use `.env.example` as a template

### Code Structure

1. **Directory Organization**
   ```
   backend/
   ├── config/          # Configuration files
   ├── controllers/     # Route controllers
   ├── middleware/      # Custom middleware
   ├── models/         # Database models
   ├── routes/         # API routes
   ├── utils/          # Utility functions
   ├── tests/          # Test files
   ├── logs/           # Application logs
   └── uploads/        # File uploads
   ```

2. **Naming Conventions**
   - Use camelCase for variables and functions
   - Use PascalCase for classes and models
   - Use snake_case for file names
   - Use UPPER_CASE for constants

### API Development

1. **API Versioning**
   - All endpoints should be versioned (e.g., `/api/v1/`)
   - Document version changes in CHANGELOG.md
   - Support at least one previous version

2. **Request Validation**
   - Use validation middleware for all inputs
   - Implement comprehensive error messages
   - Follow the error response format

3. **Security Practices**
   - Implement rate limiting
   - Use proper authentication
   - Sanitize all inputs
   - Follow OWASP guidelines

### Testing

1. **Unit Tests**
   ```bash
   npm run test
   npm run test:coverage
   ```

2. **Test Coverage Requirements**
   - Minimum 80% coverage for new code
   - Write tests for both success and failure cases
   - Mock external services

### Documentation

1. **API Documentation**
   - Keep Swagger documentation updated
   - Document all request/response schemas
   - Include example requests/responses

2. **Code Documentation**
   - Add JSDoc comments for functions
   - Document complex logic
   - Update README.md with new features

### Deployment

1. **Pre-deployment Checklist**
   - Run all tests
   - Check security vulnerabilities
   - Update dependencies
   - Review environment variables

2. **Production Considerations**
   - Enable all security middleware
   - Configure proper logging
   - Set up monitoring
   - Enable SSL/TLS

### Database

1. **Schema Changes**
   - Document all schema changes
   - Provide migration scripts
   - Consider backward compatibility

2. **Data Management**
   - Implement proper indexing
   - Handle data validation
   - Follow data privacy regulations

### Error Handling

1. **Error Response Format**
   ```json
   {
     "status": "error",
     "error": {
       "code": "ERROR_CODE",
       "message": "User-friendly error message"
     }
   }
   ```

2. **Logging Requirements**
   - Log all errors with stack traces
   - Include request context
   - Implement proper log rotation

### Code Quality

1. **Code Style**
   - Follow ESLint configuration
   - Run prettier for formatting
   - Maximum line length: 100 characters

2. **Best Practices**
   - Use async/await for asynchronous code
   - Implement proper error handling
   - Follow SOLID principles
   - Keep functions small and focused

### Pull Request Process

1. **Before Submitting**
   - Run all tests
   - Update documentation
   - Follow commit message conventions
   - Review code quality

2. **PR Requirements**
   - Detailed description of changes
   - Link related issues
   - Include test results
   - List of breaking changes

### Monitoring and Maintenance

1. **Health Checks**
   - Implement /health endpoint
   - Monitor system resources
   - Set up alerts for critical issues

2. **Backup and Recovery**
   - Regular database backups
   - Implement recovery procedures
   - Document disaster recovery plan

### Security Updates

1. **Regular Tasks**
   - Update dependencies regularly
   - Run security audits
   - Review access controls
   - Monitor security advisories

2. **Security Reporting**
   - Document security issues privately
   - Follow responsible disclosure
   - Update security documentation

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

* bug - Issues that are bugs
* documentation - Issues for improving or updating our documentation
* enhancement - Issues for new features or improvements
* good first issue - Good for newcomers
* help wanted - Extra attention is needed
* invalid - Issues that aren't valid
* question - Further information is requested

## Getting Help

If you need help, you can:

* Join our [Discord community](https://discord.gg/travelshield)
* Check out the [documentation](https://docs.travelshield.com)
* Email us at support@travelshield.com

Thank you for contributing to TravelShield! 🌍🛡️
