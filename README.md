# Surfslot API Documentation

## Authentication
All API endpoints require authentication using NextAuth session. Include the session cookie in all requests.

## Admin Endpoints

### Create Location
```http
POST /api/admin/locations
Content-Type: application/json

{
  "name": "Ericeira",
  "spots": [
    {
      "name": "Coxos",
      "id": "5842041f4e65fad6a7708bc4"
    },
    {
      "name": "Ribeira d'Ilhas",
      "id": "5842041f4e65fad6a7708bc2"
    }
  ]
}
```

### Delete Location
```http
DELETE /api/admin/locations
Content-Type: application/json

{
  "locationId": "location_id"
}
```

## User Endpoints

### Get User Locations
```http
GET /api/user/locations
```

### Add Location to User
```http
POST /api/user/locations
Content-Type: application/json

{
  "locationId": "location_id"
}
```

### Remove Location from User
```http
DELETE /api/user/locations/{locationId}
```

### Update Spot Status
```http
PUT /api/user/locations/{locationId}/spots
Content-Type: application/json

{
  "spotId": "spot_id",
  "enabled": true
}
```

### Get User Slots
```http
GET /api/slots
```

## Testing with Postman

1. Set up environment variables:
```
BASE_URL=http://localhost:3000
```

2. Add auth cookie:
- Sign in through the web interface
- Copy the `next-auth.session-token` cookie
- Add it to your Postman requests

3. Create a new collection and import the following requests:

```json
{
  "info": {
    "name": "Surfslot API"
  },
  "item": [
    {
      "name": "Admin - Create Location",
      "request": {
        "method": "POST",
        "url": "{{BASE_URL}}/api/admin/locations",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Ericeira\",\n  \"spots\": [\n    {\n      \"name\": \"Coxos\",\n      \"id\": \"5842041f4e65fad6a7708bc4\"\n    }\n  ]\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        }
      }
    },
    {
      "name": "User - Get Locations",
      "request": {
        "method": "GET",
        "url": "{{BASE_URL}}/api/user/locations"
      }
    },
    {
      "name": "User - Add Location",
      "request": {
        "method": "POST",
        "url": "{{BASE_URL}}/api/user/locations",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"locationId\": \"your_location_id\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        }
      }
    }
  ]
}
```

## Response Examples

### Location List
```json
{
  "locations": [
    {
      "id": "location_id",
      "name": "Ericeira",
      "spots": [
        {
          "id": "spot_id",
          "name": "Coxos",
          "externalId": "5842041f4e65fad6a7708bc4"
        }
      ]
    }
  ]
}
```

### User Location
```json
{
  "id": "user_location_id",
  "locationId": "location_id",
  "locationName": "Ericeira",
  "enabled": true,
  "spots": [
    {
      "id": "user_spot_id",
      "spotId": "spot_id",
      "enabled": true
    }
  ]
}
```

### Surf Slots
```json
{
  "slots": [
    {
      "id": "slot_id",
      "startTime": "2024-03-20T08:00:00Z",
      "endTime": "2024-03-20T10:00:00Z",
      "conditions": {
        "waveHeight": "Good",
        "wind": "Offshore",
        "tide": "Mid"
      }
    }
  ]
}
```