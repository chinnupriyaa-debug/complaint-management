# Anna University - Complaint Management System

A comprehensive full-stack complaint management system built with **React**, **Angular**, **Node.js/Express**, and **MongoDB**.

## Features Implemented

### Core Functionality
- **Student Portal**: Submit complaints with issue categories, priority levels, and detailed descriptions
- **Faculty Portal**: View, respond to, and manage student complaints
- **Real-time Status Tracking**: Track complaint status (Pending, In-Progress, Resolved)
- **History Management**: Both students and faculty can view complaint history
- **10-Second Alert System**: Automatic email alerts for unresponded complaints

### Advanced Features (Syllabus Topics + Extra)

| Technology | Feature | Description |
|------------|---------|-------------|
| **React** | `useMemo` | Optimized filtering and computation of complaint statistics |
| **Angular** | Route Guards | Protected routes for student and faculty dashboards |
| **Node.js** | Worker Threads | Background processing for email alerts and heavy computations |
| **Express** | Custom Middleware | Authentication, logging, rate limiting, error handling |
| **MongoDB** | Aggregation Pipeline | Advanced statistics and analytics queries |
| **Extra** | Angular Signals | Reactive state management (beyond syllabus) |

---

## Project Structure

```
complaint-system/
├── backend/                    # Node.js/Express Server
│   ├── models/                 # MongoDB Schemas
│   │   ├── User.js
│   │   └── Complaint.js
│   ├── routes/                 # API Routes
│   │   ├── auth.js
│   │   └── complaints.js
│   ├── middleware/             # Custom Middleware
│   │   └── customMiddleware.js
│   ├── workers/                # Worker Threads
│   │   ├── alertWorker.js
│   │   └── workerManager.js
│   ├── server.js               # Main server file
│   ├── seed.js                 # Database seeder
│   └── package.json
│
├── react-frontend/             # React Application
│   ├── src/
│   │   ├── context/            # Auth Context
│   │   ├── pages/              # Page Components
│   │   │   ├── HomePage.jsx
│   │   │   ├── StudentLogin.jsx
│   │   │   ├── FacultyLogin.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── FacultyDashboard.jsx
│   │   ├── styles/             # CSS Styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── angular-frontend/           # Angular Application
    ├── src/
    │   ├── app/
    │   │   ├── guards/         # Route Guards
    │   │   ├── services/       # Auth & Complaint Services
    │   │   ├── interceptors/   # HTTP Interceptors
    │   │   ├── pages/          # Components
    │   │   ├── app.routes.ts
    │   │   └── app.config.ts
    │   ├── styles.css
    │   └── main.ts
    └── package.json
```

---

## Setup Instructions

### Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (Local installation or MongoDB Atlas)
3. **npm** or **yarn**

### Step 1: Install MongoDB

#### Option A: Local Installation
```bash
# Windows (using Chocolatey)
choco install mongodb

# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd complaint-system/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your settings:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/complaint_system
# JWT_SECRET=your_super_secret_jwt_key_change_this
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASS=your_app_password

# Seed the database with test data
npm run seed

# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

### Step 3: Setup React Frontend

```bash
# Navigate to React frontend directory
cd complaint-system/react-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# React app runs on http://localhost:5173
```

### Step 4: Setup Angular Frontend

```bash
# Navigate to Angular frontend directory
cd complaint-system/angular-frontend

# Install dependencies
npm install

# Start development server
npm start

# Angular app runs on http://localhost:4200
```

---

## Test Credentials

After running `npm run seed` in the backend:

### Students
| Username | Password | Department |
|----------|----------|------------|
| john_student | password123 | CSE |
| jane_student | password123 | ECE |
| mike_student | password123 | MECH |

### Faculty
| Username | Password | Department |
|----------|----------|------------|
| prof_smith | password123 | CSE |
| prof_jones | password123 | ECE |
| dr_wilson | password123 | MECH |

---

## API Endpoints

### Authentication
```
POST /api/auth/register     - Register new user
POST /api/auth/login        - Login user
GET  /api/auth/verify       - Verify JWT token
GET  /api/auth/profile      - Get user profile
```

### Complaints
```
POST /api/complaints/submit           - Submit new complaint (Student)
GET  /api/complaints/my-complaints    - Get student's complaints
GET  /api/complaints/all              - Get all complaints (Faculty)
PUT  /api/complaints/respond/:id      - Respond to complaint (Faculty)
GET  /api/complaints/stats            - Get statistics (Faculty)
GET  /api/complaints/check-overdue    - Check for overdue complaints
```

---

## Feature Implementation Details

### 1. React - useMemo Hook

**Location**: `react-frontend/src/pages/FacultyDashboard.jsx`

```jsx
// Memoized complaint filtering for performance
const filteredComplaints = useMemo(() => {
  return complaints.filter(complaint => {
    const matchesSearch = searchTerm === '' || 
      complaint.studentId?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || 
      complaint.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || 
      complaint.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });
}, [complaints, searchTerm, priorityFilter, statusFilter]);

// Memoized statistics calculation
const stats = useMemo(() => ({
  total: complaints.length,
  pending: complaints.filter(c => c.status === 'pending').length,
  resolved: complaints.filter(c => c.status === 'resolved').length,
  highPriority: complaints.filter(c => c.priority === 'high').length,
}), [complaints]);
```

### 2. Angular - Route Guards

**Location**: `angular-frontend/src/app/guards/auth.guard.ts`

```typescript
// Authentication Guard
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};

// Role-based Guards
export const studentGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const user = authService.getCurrentUser();
  
  if (user && user.role === 'student') {
    return true;
  }

  return false;
};

export const facultyGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const user = authService.getCurrentUser();
  
  if (user && user.role === 'faculty') {
    return true;
  }

  return false;
};
```

### 3. Node.js - Worker Threads

**Location**: `backend/workers/alertWorker.js`

```javascript
const { parentPort, workerData } = require('worker_threads');

// Worker thread for processing email alerts
parentPort.on('message', async (message) => {
  if (message.type === 'SEND_ALERT') {
    const { facultyEmail, complaintId, studentName, issue } = message.data;
    
    // Process email sending in separate thread
    const result = await sendAlertEmail(facultyEmail, complaintId, studentName, issue);
    
    parentPort.postMessage({
      type: 'ALERT_SENT',
      data: { complaintId, success: result }
    });
  }
});
```

### 4. Express - Custom Middleware

**Location**: `backend/middleware/customMiddleware.js`

```javascript
// Authentication Middleware
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Role-based Authorization Middleware
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

// Request Logging Middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} [${duration}ms]`);
  });
  next();
};

// Rate Limiting Middleware
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});
```

### 5. MongoDB - Aggregation Pipeline

**Location**: `backend/routes/complaints.js`

```javascript
// Get comprehensive statistics using aggregation pipeline
router.get('/stats', authMiddleware, roleMiddleware('faculty'), async (req, res) => {
  const stats = await Complaint.aggregate([
    // Stage 1: Match complaints
    { $match: {} },
    
    // Stage 2: Group by status
    {
      $facet: {
        byStatus: [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        byPriority: [
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ],
        byIssue: [
          { $group: { _id: '$issue', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ],
        total: [
          { $count: 'count' }
        ],
        avgResolutionTime: [
          { $match: { status: 'resolved', resolvedAt: { $exists: true } } },
          {
            $project: {
              resolutionTime: {
                $divide: [
                  { $subtract: ['$resolvedAt', '$createdAt'] },
                  1000 * 60 // Convert to minutes
                ]
              }
            }
          },
          { $group: { _id: null, avg: { $avg: '$resolutionTime' } } }
        ]
      }
    }
  ]);

  res.json(stats[0]);
});
```

### 6. Extra Topic - Angular Signals (Reactive State Management)

**Location**: `angular-frontend/src/app/services/auth.service.ts`

```typescript
// Angular Signals for reactive state (Angular 16+ feature)
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signal-based state
  private userSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  // Computed signals for derived state
  isLoggedIn = computed(() => !!this.tokenSignal());
  currentUser = computed(() => this.userSignal());
  userRole = computed(() => this.userSignal()?.role || null);

  login(username: string, password: string, role: string) {
    return this.http.post<AuthResponse>('/api/auth/login', { username, password, role })
      .pipe(
        tap(response => {
          // Update signals reactively
          this.tokenSignal.set(response.token);
          this.userSignal.set(response.user);
        })
      );
  }
}
```

---

## Screenshots

### Home Page
- Anna University themed landing page with student and faculty login options
- Gradient blue background with university logo watermark

### Student Dashboard
- Submit complaints with issue categories and priority levels
- View complaint history with status tracking
- Filter complaints by status and priority

### Faculty Dashboard
- View all pending complaints in a table format
- Respond to complaints with status updates
- View statistics and analytics with charts
- Automatic alert system for overdue complaints

---

## Email Alert System

The system automatically sends email alerts when:
1. A complaint is not responded to within **10 seconds**
2. The alert is sent to the registered faculty email
3. Worker threads handle email processing in the background

To enable email alerts:
1. Enable "Less secure app access" in Gmail or create an App Password
2. Update `.env` with your email credentials:
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## Technologies Used

- **Frontend**: React 18, Angular 17, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Custom CSS with gradients and animations
- **State Management**: React Context, Angular Signals
- **Email**: Nodemailer
- **Background Processing**: Node.js Worker Threads

---

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# If using Atlas, ensure IP is whitelisted
```

### CORS Errors
The backend is configured to accept requests from:
- http://localhost:5173 (React)
- http://localhost:4200 (Angular)

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Or change port in .env file
```

---

## License

This project is created for educational purposes - Anna University Complaint Management System.
