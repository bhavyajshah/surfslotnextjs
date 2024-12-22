# Surfslot API Documentation

## API Endpoints

### User Locations

#### Get User Locations
```http
GET /api/user/locations
```

Headers:
```
Cookie: next-auth.session-token=<your-session-token>
```

Response:
```json
[
  {
    "id": "location_id",
    "userId": "user_id",
    "locationId": "location_id",
    "locationName": "Ericeira",
    "enabled": true,
    "spots": [
      {
        "id": "spot_id",
        "name": "Coxos",
        "enabled": false
      }
    ]
  }
]
```

#### Add User Location
```http
POST /api/user/locations
```

Headers:
```
Cookie: next-auth.session-token=<your-session-token>
Content-Type: application/json
```

Body:
```json
{
  "locationId": "location_id",
  "locationName": "Ericeira",
  "spots": [
    {
      "name": "Coxos",
      "id": "spot_id"
    }
  ]
}
```

### Locations

#### Get All Locations
```http
GET /api/locations
```

Headers:
```
Cookie: next-auth.session-token=<your-session-token>
```

Response:
```json
[
  {
    "id": "location_id",
    "name": "Ericeira",
    "spots": [
      {
        "id": "spot_id",
        "name": "Coxos"
      }
    ]
  }
]
```

#### Toggle Spot Status
```http
PATCH /api/locations/{locationId}/spots/{spotId}
```

Headers:
```
Cookie: next-auth.session-token=<your-session-token>
Content-Type: application/json
```

Body:
```json
{
  "enabled": true
}
```

## Testing in Postman

1. Get the session token:
   - Log in to the application in your browser
   - Open DevTools (F12)
   - Go to Application > Cookies
   - Copy the value of `next-auth.session-token`

2. Create a new environment in Postman with these variables:
   - `baseUrl`: `http://localhost:3000/api`
   - `sessionToken`: Your copied session token

3. Add this Pre-request Script to your collection to automatically set the cookie:
```javascript
pm.request.headers.add({
    key: 'Cookie',
    value: `next-auth.session-token=${pm.environment.get('sessionToken')}`
});
```

4. Import the provided endpoints and start testing!

## Error Responses

All endpoints return standard HTTP status codes:

- 200: Success
- 401: Unauthorized (missing or invalid session)
- 500: Server Error

Error response format:
```json
{
  "error": "Error message"
}
```