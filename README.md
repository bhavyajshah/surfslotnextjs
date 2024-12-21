# Surfslot API Documentation

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Postman for API testing

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/surfslot.git
cd surfslot
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Start the development server
```bash
npm run dev
```

## API Documentation

### Authentication
All API endpoints require authentication using NextAuth session. The session token must be included in the request cookies.

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Locations

##### Get All Locations
```http
GET /locations
```

Response:
```json
{
  "locations": [
    {
      "id": "location_id",
      "name": "Ericeira",
      "active": true,
      "spots": [
        {
          "id": "spot_id",
          "name": "Coxos",
          "active": true
        }
      ]
    }
  ]
}
```

##### Add Location
```http
POST /locations
Content-Type: application/json

{
  "name": "Ericeira",
  "spots": [
    {
      "name": "Coxos",
      "id": "spot_123"
    }
  ]
}
```

##### Update Location
```http
PUT /locations/{locationId}
Content-Type: application/json

{
  "active": true
}
```

#### 2. Spots

##### Toggle Spot Status
```http
PATCH /locations/{locationId}/spots/{spotId}
Content-Type: application/json

{
  "active": true
}
```

#### 3. User Settings

##### Update Notifications
```http
PUT /user/notifications
Content-Type: application/json

{
  "enabled": true
}
```

## Testing with Postman

1. Set up a new Postman environment
2. Add the following variables:
   - `baseUrl`: `http://localhost:3000/api`
   - `authToken`: Your NextAuth session token

3. Import the following collection:

```json
{
  "info": {
    "name": "Surfslot API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Locations",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/locations",
        "headers": {
          "Cookie": "next-auth.session-token={{authToken}}"
        }
      }
    },
    {
      "name": "Add Location",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/locations",
        "headers": {
          "Cookie": "next-auth.session-token={{authToken}}",
          "Content-Type": "application/json"
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Ericeira\",\n  \"spots\": [\n    {\n      \"name\": \"Coxos\",\n      \"id\": \"spot_123\"\n    }\n  ]\n}"
        }
      }
    },
    {
      "name": "Toggle Spot",
      "request": {
        "method": "PATCH",
        "url": "{{baseUrl}}/locations/{{locationId}}/spots/{{spotId}}",
        "headers": {
          "Cookie": "next-auth.session-token={{authToken}}",
          "Content-Type": "application/json"
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"active\": true\n}"
        }
      }
    }
  ]
}
```

### Getting the Auth Token

1. Sign in to the application through the web interface
2. Open browser DevTools (F12)
3. Go to Application > Cookies
4. Copy the value of `next-auth.session-token`
5. Paste it as the `authToken` variable in Postman

## Error Handling

All API endpoints return standard HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

Error Response Format:
```json
{
  "error": "Error message description"
}
```