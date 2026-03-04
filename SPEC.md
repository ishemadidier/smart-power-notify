# Smart Power Notify - System Specification

## Project Overview
- **Project Name**: Smart Power Notify
- **Purpose**: A notification system connecting Rwanda Energy Group (REG) with citizens to inform about power outages, maintenance schedules, and restoration times
- **Target Users**: REG staff (admins) and electricity customers in Rwanda
- **Tech Stack**: React.js (Frontend), Node.js + Express (Backend), MongoDB (Database)

## Architecture

### Frontend Structure
```
client/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── admin/
│   │   └── user/
│   ├── pages/
│   │   ├── admin/
│   │   └── user/
│   ├── context/
│   ├── services/
│   └── utils/
```

```
server/
├──### Backend Structure
 config/
├── controllers/
├── models/
├── routes/
├── middleware/
└── utils/
```

## Database Design (MongoDB)

### Users Collection
```
json
{
  "name": "string",
  "phone": "string",
  "meterNumber": "string",
  "province": "string",
  "district": "string",
  "sector": "string",
  "email": "string",
  "password": "string (hashed)",
  "role": "user | admin | superadmin",
  "isActive": "boolean",
  "createdAt": "timestamp"
}
```

### Notifications Collection
```
json
{
  "title": "string",
  "message": "string",
  "area": {
    "province": "string",
    "district": "string",
    "sector": "string"
  },
  "startTime": "timestamp",
  "endTime": "timestamp",
  "type": "planned | emergency | maintenance | restoration",
  "status": "active | resolved",
  "createdBy": "userId",
  "smsSent": "boolean",
  "createdAt": "timestamp"
}
```

### Reports Collection
```
json
{
  "userId": "userId",
  "type": "outage | low_voltage | damaged_line",
  "description": "string",
  "image": "string (url)",
  "status": "pending | in_progress | resolved | rejected",
  "adminResponse": "string",
  "location": {
    "province": "string",
    "district": "string",
    "sector": "string"
  },
  "createdAt": "timestamp",
  "resolvedAt": "timestamp"
}
```

## UI/UX Specification

### Color Palette
- **Primary**: Sky Blue (#0EA5E9) - Electric theme
- **Secondary**: Dark Navy (#1E3A5F)
- **Accent**: Lightning Yellow (#FACC15)
- **Background**: Light Gray (#F8FAFC)
- **Success**: Green (#22C55E)
- **Warning**: Orange (#F97316)
- **Error**: Red (#EF4444)
- **Text Primary**: Dark (#1E293B)
- **Text Secondary**: Gray (#64748B)

### Typography
- **Primary Font**: 'Inter', sans-serif
- **Headings**: Bold, various sizes
- **Body**: Regular weight

### Layout
- Responsive design (mobile-first)
- Sidebar navigation for admin
- Top navigation for user dashboard
- Card-based content display

## Features

### User Features
1. Registration/Login with phone & meter number
2. Dashboard with latest notifications
3. Area-specific alerts
4. Outage history view
5. Report power issues (with photo upload)
6. Track complaint status
7. Real-time notifications (Socket.io)

### Admin Features
1. Secure login with role-based access
2. Create outage notifications
3. Auto-send SMS to affected users
4. Manage users (view, filter, disable)
5. Handle reports (change status, respond)
6. Analytics dashboard

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

### Notifications
- GET /api/notifications (with filters)
- POST /api/notifications
- PUT /api/notifications/:id
- DELETE /api/notifications/:id

### Reports
- GET /api/reports
- POST /api/reports
- PUT /api/reports/:id
- GET /api/reports/user/:userId

### Users (Admin)
- GET /api/users
- PUT /api/users/:id
- DELETE /api/users/:id
- GET /api/users/stats

## Acceptance Criteria
1. Users can register and login
2. Users receive notifications relevant to their area
3. Admins can create and send notifications
4. SMS notifications work (simulated in demo)
5. Real-time updates via Socket.io
6. Reports can be submitted and tracked
7. Admin dashboard shows analytics
8. Responsive design works on all devices
