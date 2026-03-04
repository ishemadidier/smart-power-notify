# Smart Power Notify ⚡

A comprehensive notification system for Rwanda Energy Group (REG) to inform citizens about power outages, maintenance schedules, and restoration times.

## 🚀 Features

### User Features
- 📱 User registration and authentication
- 🔔 Real-time outage notifications
- 📍 Area-specific alerts
- 📝 Report power issues
- 📊 Track complaint status
- 🖥️ User dashboard

### Admin Features
- 👨‍💼 Role-based access (Admin/Superadmin)
- 🔔 Create and manage notifications
- 📤 Auto-send SMS notifications (simulated)
- 👥 Manage users
- 📝 Handle user reports
- 📊 Analytics dashboard

## 🏗️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time**: Socket.io
- **SMS**: Twilio/Africa's Talking (ready for integration)

## 📁 Project Structure

```
SMART POWER/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   │   ├── admin/    # Admin pages
│   │   │   └── user/     # User pages
│   │   ├── context/      # React context
│   │   ├── services/     # API services
│   │   └── utils/        # Utilities
│   └── package.json
├── server/                # Node.js Backend
│   ├── controllers/      # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── index.js         # Server entry
│   └── package.json
├── SPEC.md              # System specification
└── README.md
```

## 🛠️ Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Backend Setup
```
bash
cd server
npm install
# Configure .env file (see .env.example)
npm start
```

### Frontend Setup
```
bash
cd client
npm install
npm start
```

## 🔧 Configuration

### Environment Variables

**Server (.env)**
```
env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-power-notify
JWT_SECRET=your-secret-key
```

**Client (.env)**
```
env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📱 Demo Credentials

After creating an admin user:
- **Admin Login**: Use registered admin credentials
- **User Login**: Use registered user credentials

## 🔌 API Endpoints

### Auth
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile

### Notifications
- GET `/api/notifications` - Get all notifications
- GET `/api/notifications/my` - Get user's notifications
- POST `/api/notifications` - Create notification (admin)
- PUT `/api/notifications/:id` - Update notification
- DELETE `/api/notifications/:id` - Delete notification

### Reports
- GET `/api/reports` - Get all reports (admin)
- GET `/api/reports/my` - Get user's reports
- POST `/api/reports` - Create report
- PUT `/api/reports/:id` - Update report status

### Users
- GET `/api/users` - Get all users (admin)
- GET `/api/users/stats` - Get user statistics

## 🎨 UI Colors

- **Primary**: Sky Blue (#0EA5E9)
- **Secondary**: Dark Navy (#1E3A5F)
- **Accent**: Lightning Yellow (#FACC15)

## 🌍 Rwanda Regions

The system supports all Rwanda provinces and districts:
- Kigali City
- Northern Province
- Southern Province
- Eastern Province
- Western Province

## 📄 License

MIT License - Feel free to use this project for educational purposes.

## 👨‍💻 Author

Built for Rwanda Energy Group - Smart Power Notify Project
