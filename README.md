# Surfslot - Surf Session Scheduler

A Next.js application that helps surfers schedule their sessions based on conditions and automatically syncs with Google Calendar.

## Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database Architecture](#database-architecture)
- [API Documentation](#api-documentation)
- [Development Guide](#development-guide)

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB database
- Google OAuth credentials
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/surfslot.git
cd surfslot
```

2. Install dependencies:
```bash
npm install
```

3. Set up your database:
```bash
npx prisma generate
npx prisma db push
```

4. Create `.env` file:
```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/surfslot"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Admin
ADMIN_EMAIL="your-admin-email@example.com"
```

5. Start development server:
```bash
npm run dev
```

## Project Structure

```
surfslot/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   └── dashboard/         # User dashboard
├── components/            # React components
├── lib/                   # Utility functions
├── hooks/                # Custom React hooks
├── prisma/               # Database schema
└── types/                # TypeScript types
```

## Database Architecture

### Collections

#### Users Collection
```typescript
interface User {
  id: string;
  email: string;           // Unique
  name: string | null;
  calendarNotifications: boolean;
  selectedSpots: string[]; // Array of Spot IDs
  createdAt: Date;
  updatedAt: Date;
}
```

#### Locations Collection
```typescript
interface Location {
  id: string;
  name: string;
  city: string;
  active: boolean;
  spots: Spot[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### Spots Collection
```typescript
interface Spot {
  id: string;
  name: string;
  active: boolean;
  conditions: {
    waveHeight?: string;
    wind?: string;
    tide?: string;
    bestTimeToSurf?: string[];
  };
  locationId: string;  // Reference to Location
  createdAt: Date;
  updatedAt: Date;
}
```

#### DailyUpdates Collection
```typescript
interface DailyUpdate {
  id: string;
  spotId: string;      // Reference to Spot
  message: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Documentation

### Authentication

#### Sign In
```http
POST /api/auth/signin
Content-Type: application/json

{
  "provider": "google"
}
```

Response:
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  },
  "accessToken": "jwt_token"
}
```

### Admin API Endpoints

#### Create Location
```http
POST /api/admin/locations
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Ericeira",
  "city": "Lisbon",
  "spots": [
    {
      "name": "Coxos",
      "conditions": {
        "waveHeight": "medium",
        "wind": "offshore",
        "tide": "mid",
        "bestTimeToSurf": ["morning", "evening"]
      }
    }
  ]
}
```

#### Update Location
```http
PUT /api/admin/locations/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "active": true,
  "spots": [
    {
      "id": "spot_id",
      "active": true
    }
  ]
}
```

#### Delete Location
```http
DELETE /api/admin/locations/:id
Authorization: Bearer <token>
```

#### Create Spot Update
```http
POST /api/admin/spots/:spotId/updates
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Perfect conditions expected",
  "startTime": "2024-03-20T08:00:00Z",
  "endTime": "2024-03-20T12:00:00Z"
}
```

### User API Endpoints

#### Get User Profile
```http
GET /api/user
Authorization: Bearer <token>
```

Response:
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "calendarNotifications": true,
  "selectedSpots": ["spot_id_1", "spot_id_2"]
}
```

#### Update Selected Spots
```http
PUT /api/user/spots
Authorization: Bearer <token>
Content-Type: application/json

{
  "spots": ["spot_id_1", "spot_id_2"]
}
```

#### Toggle Notifications
```http
PUT /api/user/notifications
Authorization: Bearer <token>
Content-Type: application/json

{
  "enabled": true
}
```

### Location API Endpoints

#### Get All Locations
```http
GET /api/locations
```

Response:
```json
{
  "locations": [
    {
      "id": "location_id",
      "name": "Ericeira",
      "city": "Lisbon",
      "active": true,
      "spots": [
        {
          "id": "spot_id",
          "name": "Coxos",
          "active": true,
          "conditions": {
            "waveHeight": "medium",
            "wind": "offshore",
            "tide": "mid"
          }
        }
      ]
    }
  ]
}
```

#### Get Location Details
```http
GET /api/locations/:locationId
```

#### Get Location Spots
```http
GET /api/locations/:locationId/spots
```

### Surf Slots API Endpoints

#### Get Available Slots
```http
GET /api/slots
Authorization: Bearer <token>
```

Response:
```json
{
  "slots": [
    {
      "id": "slot_id",
      "date": "2024-03-20T08:00:00Z",
      "location": "Ericeira",
      "spot": "Coxos",
      "conditions": {
        "waveHeight": "medium",
        "wind": "offshore",
        "tide": "mid"
      }
    }
  ]
}
```

## Development Guide

### Running Tests
```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- components/MyComponent.test.tsx
```

### Building for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Reset database
npx prisma db reset
```

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Format code with Prettier
- Write unit tests for components
- Use React Query for data fetching
- Implement error boundaries

### Deployment
1. Build the application:
```bash
npm run build
```

2. Set environment variables on your hosting platform

3. Deploy the application:
```bash
npm start
```