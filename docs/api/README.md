# TravelShield API Documentation

## API Overview

TravelShield's API is organized around REST principles. Our API has predictable resource-oriented URLs, accepts JSON-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.

## Base URL

```
Production: https://api.travelshield.com/v1
Staging: https://staging-api.travelshield.com/v1
Development: http://localhost:5000/v1
```

## Authentication

TravelShield uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## API Versioning

All endpoints are versioned using URL path versioning:
```
/v1/... # Current stable version
/v2/... # Beta version (when available)
```

For version changelog, see our [GitHub Releases](https://github.com/adityayadav71/travelshield/releases)

## Rate Limiting

- 100 requests per IP per 15-minute window
- Rate limit headers included in responses:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

## Endpoints

### Authentication

#### Register New User
```http
POST /api/v1/auth/register
```

Request body:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "fullName": "string"
}
```

Response:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "string"
  }
}
```

#### Login
```http
POST /api/v1/auth/login
```

Request body:
```json
{
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

### Safety Alerts

#### Get Safety Alerts
```http
GET /api/v1/safety/alerts
```

Query parameters:
```
latitude: number
longitude: number
radius: number (in meters)
type: string (optional)
```

Response:
```json
{
  "alerts": [
    {
      "id": "string",
      "type": "string",
      "severity": "string",
      "description": "string",
      "location": {
        "type": "Point",
        "coordinates": [number, number],
        "address": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

#### Create Safety Alert
```http
POST /api/v1/safety/alerts
```

Request body:
```json
{
  "type": "string",
  "severity": "string",
  "description": "string",
  "location": {
    "type": "Point",
    "coordinates": [number, number],
    "address": "string"
  }
}
```

### Accommodation

#### Search Stays
```http
GET /api/v1/stay/search
```

Query parameters:
```
location: string
checkIn: string (ISO date)
checkOut: string (ISO date)
guests: number
priceMin: number (optional)
priceMax: number (optional)
```

Response:
```json
{
  "stays": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "price": number,
      "location": {
        "address": "string",
        "coordinates": [number, number]
      },
      "amenities": ["string"],
      "images": ["string"],
      "host": {
        "id": "string",
        "name": "string",
        "rating": number
      }
    }
  ]
}
```

### Bookings

#### Create Booking
```http
POST /api/v1/bookings
```

Request body:
```json
{
  "stayId": "string",
  "checkIn": "string",
  "checkOut": "string",
  "guests": number,
  "totalPrice": number
}
```

Response:
```json
{
  "booking": {
    "id": "string",
    "status": "string",
    "checkIn": "string",
    "checkOut": "string",
    "guests": number,
    "totalPrice": number,
    "paymentStatus": "string"
  }
}
```

### Claims

#### Submit Claim
```http
POST /api/v1/claims
```

Request body:
```json
{
  "type": "string",
  "description": "string",
  "amount": number,
  "documents": ["string"],
  "incidentDate": "string"
}
```

Response:
```json
{
  "claim": {
    "id": "string",
    "status": "string",
    "type": "string",
    "amount": number,
    "createdAt": "string"
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

### Common Error Codes

- `AUTH001`: Authentication failed
- `AUTH002`: Token expired
- `VAL001`: Validation error
- `RES001`: Resource not found
- `BUS001`: Business logic error
- `SRV001`: Server error

## Webhooks

TravelShield can send webhook notifications for various events:

```http
POST https://your-webhook-url.com
```

Example payload:
```json
{
  "event": "booking.confirmed",
  "data": {
    "bookingId": "string",
    "status": "string",
    "timestamp": "string"
  }
}
```

## SDK Examples

### JavaScript
```javascript
const TravelShield = require('@travelshield/sdk');

const client = new TravelShield('your-api-key');

// Get safety alerts
const alerts = await client.safety.getAlerts({
  latitude: 40.7128,
  longitude: -74.0060,
  radius: 1000
});
```

### Python
```python
from travelshield import TravelShield

client = TravelShield('your-api-key')

# Create booking
booking = client.bookings.create(
    stay_id='stay123',
    check_in='2024-01-01',
    check_out='2024-01-05',
    guests=2
)
```

## API Status

Check the API status at [status.travelshield.com](https://status.travelshield.com)

## Rate Limits

| Plan | Requests/15-min | Price |
|------|----------------|-------|
| Free | 100 | $0 |
| Pro | 1000 | $49/month |
| Enterprise | Custom | Contact us |

## Support

- Email: api-support@travelshield.com
- API Issues: [GitHub Issues](https://github.com/Chikun2004/travelshield/issues)
- Documentation: [docs.travelshield.com/api](https://docs.travelshield.com/api)

## Changelog

See [CHANGELOG.md](../../CHANGELOG.md) for API version history.
