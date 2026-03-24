"use client"

import { useState } from "react"

export default function ComplaintManagementSystem() {
  const [activeTab, setActiveTab] = useState<"overview" | "react" | "angular" | "backend" | "setup">("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header with Anna University Theme */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Anna_University_Logo.svg/1200px-Anna_University_Logo.svg.png')] bg-center bg-no-repeat opacity-10" />
        <div className="relative z-10 px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Anna_University_Logo.svg/1200px-Anna_University_Logo.svg.png" 
              alt="Anna University Logo" 
              className="w-20 h-20"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Anna University</h1>
              <p className="text-blue-300">Complaint Management System</p>
            </div>
          </div>
          <p className="text-slate-300 max-w-2xl mx-auto">
            A comprehensive full-stack application with React, Angular, Node.js, Express, and MongoDB
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="sticky top-0 z-20 bg-slate-800/90 backdrop-blur border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2">
            {[
              { id: "overview", label: "Overview" },
              { id: "react", label: "React Frontend" },
              { id: "angular", label: "Angular Frontend" },
              { id: "backend", label: "Backend API" },
              { id: "setup", label: "Setup Guide" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "overview" && <OverviewSection />}
        {activeTab === "react" && <ReactSection />}
        {activeTab === "angular" && <AngularSection />}
        {activeTab === "backend" && <BackendSection />}
        {activeTab === "setup" && <SetupSection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-6 text-center text-slate-400">
        <p>Complaint Management System - Anna University</p>
        <p className="text-sm mt-1">Built with React, Angular, Node.js, Express, MongoDB</p>
      </footer>
    </div>
  )
}

function OverviewSection() {
  const features = [
    {
      title: "Student Portal",
      description: "Submit complaints with priority levels, track status, view history",
      icon: "👨‍🎓",
    },
    {
      title: "Faculty Dashboard",
      description: "View all complaints, respond to issues, manage pending/rectified status",
      icon: "👨‍🏫",
    },
    {
      title: "10-Second Alert System",
      description: "Automatic email alerts using Worker Threads if complaints aren't addressed",
      icon: "⏰",
    },
    {
      title: "Complete History",
      description: "Both students and faculty can view all complaint history",
      icon: "📋",
    },
  ]

  const techStack = [
    { name: "React", feature: "useMemo for optimized filtering", color: "bg-cyan-500" },
    { name: "Angular", feature: "Route Guards for authentication", color: "bg-red-500" },
    { name: "Node.js", feature: "Worker Threads for background tasks", color: "bg-green-500" },
    { name: "Express", feature: "Custom Middleware (auth, logging, rate limiting)", color: "bg-gray-500" },
    { name: "MongoDB", feature: "Aggregation Pipeline for statistics", color: "bg-green-600" },
  ]

  return (
    <div className="space-y-8">
      {/* Project Architecture */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Project Architecture</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-cyan-900/30 border border-cyan-700 rounded-lg p-4">
            <h3 className="text-cyan-400 font-semibold mb-2">React Frontend</h3>
            <p className="text-slate-300 text-sm">Port 5173 (Vite)</p>
            <ul className="text-slate-400 text-sm mt-2 space-y-1">
              <li>- useMemo Hook</li>
              <li>- Context API</li>
              <li>- React Router</li>
            </ul>
          </div>
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
            <h3 className="text-red-400 font-semibold mb-2">Angular Frontend</h3>
            <p className="text-slate-300 text-sm">Port 4200</p>
            <ul className="text-slate-400 text-sm mt-2 space-y-1">
              <li>- Route Guards</li>
              <li>- Signals (Extra Topic)</li>
              <li>- HTTP Interceptors</li>
            </ul>
          </div>
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <h3 className="text-green-400 font-semibold mb-2">Backend API</h3>
            <p className="text-slate-300 text-sm">Port 5000</p>
            <ul className="text-slate-400 text-sm mt-2 space-y-1">
              <li>- Worker Threads</li>
              <li>- Custom Middleware</li>
              <li>- Aggregation Pipeline</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-4 p-4 bg-slate-700/50 rounded-lg">
              <span className="text-3xl">{feature.icon}</span>
              <div>
                <h3 className="text-white font-semibold">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack with Special Topics */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Technology Stack & Special Topics</h2>
        <div className="space-y-3">
          {techStack.map((tech, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg">
              <span className={`${tech.color} px-3 py-1 rounded text-white text-sm font-medium`}>
                {tech.name}
              </span>
              <span className="text-slate-300">{tech.feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* User Credentials */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Test Credentials</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <h3 className="text-blue-400 font-semibold mb-2">Student Accounts</h3>
            <div className="text-slate-300 text-sm space-y-2">
              <p><strong>Username:</strong> student1 | <strong>Password:</strong> password123</p>
              <p><strong>Username:</strong> student2 | <strong>Password:</strong> password123</p>
              <p><strong>Username:</strong> student3 | <strong>Password:</strong> password123</p>
            </div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
            <h3 className="text-purple-400 font-semibold mb-2">Faculty Accounts</h3>
            <div className="text-slate-300 text-sm space-y-2">
              <p><strong>Username:</strong> faculty1 | <strong>Password:</strong> password123</p>
              <p><strong>Username:</strong> faculty2 | <strong>Password:</strong> password123</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ReactSection() {
  return (
    <div className="space-y-6">
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">React Frontend - useMemo Implementation</h2>
        <p className="text-slate-300 mb-4">
          The React frontend uses <code className="bg-slate-700 px-2 py-1 rounded">useMemo</code> for optimized filtering and statistics calculation.
        </p>

        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-slate-300">
{`// StudentDashboard.jsx - useMemo for filtering complaints
const filteredComplaints = useMemo(() => {
  return complaints.filter(complaint => {
    const matchesSearch = complaint.issue.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      complaint.complaint.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      complaint.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || 
      complaint.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });
}, [complaints, searchTerm, statusFilter, priorityFilter]);

// useMemo for statistics calculation
const statistics = useMemo(() => {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'pending').length;
  const inProgress = complaints.filter(c => c.status === 'in-progress').length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  return { total, pending, inProgress, resolved };
}, [complaints]);`}
          </pre>
        </div>
      </section>

      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Project Structure</h2>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300">
{`react-frontend/
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── context/
    │   └── AuthContext.jsx      # Authentication state
    ├── pages/
    │   ├── HomePage.jsx         # Landing page
    │   ├── HomePage.css
    │   ├── StudentLogin.jsx     # Student auth
    │   ├── FacultyLogin.jsx     # Faculty auth
    │   ├── LoginPage.css
    │   ├── StudentDashboard.jsx # useMemo implementation
    │   ├── FacultyDashboard.jsx # useMemo implementation
    │   └── Dashboard.css
    └── styles/
        └── global.css`}
        </div>
      </section>
    </div>
  )
}

function AngularSection() {
  return (
    <div className="space-y-6">
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Angular Frontend - Route Guards</h2>
        <p className="text-slate-300 mb-4">
          The Angular frontend implements Route Guards for protecting dashboard routes based on user role.
        </p>

        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-slate-300">
{`// auth.guard.ts - Route Guards Implementation
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Generic authentication guard
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }
  
  router.navigate(['/']);
  return false;
};

// Student-specific guard
export const studentGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.getUserRole() === 'student') {
    return true;
  }
  
  router.navigate(['/student-login']);
  return false;
};

// Faculty-specific guard
export const facultyGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.getUserRole() === 'faculty') {
    return true;
  }
  
  router.navigate(['/faculty-login']);
  return false;
};`}
          </pre>
        </div>
      </section>

      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Angular Signals (Extra Topic)</h2>
        <p className="text-slate-300 mb-4">
          Uses Angular Signals for reactive state management - a new feature in Angular 16+.
        </p>

        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-slate-300">
{`// Using Angular Signals for reactive state
import { signal, computed } from '@angular/core';

export class StudentDashboardComponent {
  // Signals for reactive state
  complaints = signal<Complaint[]>([]);
  searchTerm = signal('');
  statusFilter = signal('all');

  // Computed signal for filtered complaints
  filteredComplaints = computed(() => {
    return this.complaints().filter(complaint => {
      const matchesSearch = complaint.issue.toLowerCase()
        .includes(this.searchTerm().toLowerCase());
      const matchesStatus = this.statusFilter() === 'all' || 
        complaint.status === this.statusFilter();
      return matchesSearch && matchesStatus;
    });
  });

  // Computed statistics
  statistics = computed(() => ({
    total: this.complaints().length,
    pending: this.complaints().filter(c => c.status === 'pending').length,
    resolved: this.complaints().filter(c => c.status === 'resolved').length
  }));
}`}
          </pre>
        </div>
      </section>

      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Routes Configuration</h2>
        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-slate-300">
{`// app.routes.ts - Using Route Guards
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'student-login', component: StudentLoginComponent },
  { path: 'faculty-login', component: FacultyLoginComponent },
  { 
    path: 'student-dashboard', 
    component: StudentDashboardComponent,
    canActivate: [studentGuard]  // Protected route
  },
  { 
    path: 'faculty-dashboard', 
    component: FacultyDashboardComponent,
    canActivate: [facultyGuard]  // Protected route
  },
  { path: '**', redirectTo: '' }
];`}
          </pre>
        </div>
      </section>
    </div>
  )
}

function BackendSection() {
  return (
    <div className="space-y-6">
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Node.js Worker Threads</h2>
        <p className="text-slate-300 mb-4">
          Worker Threads handle the 10-second alert system in the background without blocking the main thread.
        </p>

        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-slate-300">
{`// workerManager.js - Managing Worker Threads
const { Worker } = require('worker_threads');
const path = require('path');

class WorkerManager {
  constructor() {
    this.workers = new Map();
    this.complaintTimers = new Map();
  }

  // Start monitoring a complaint for 10-second timeout
  startComplaintMonitor(complaintId, facultyEmail) {
    const worker = new Worker(
      path.join(__dirname, 'alertWorker.js'),
      {
        workerData: {
          complaintId,
          facultyEmail,
          timeout: 10000 // 10 seconds
        }
      }
    );

    worker.on('message', (message) => {
      if (message.type === 'ALERT_SENT') {
        console.log(\`Alert sent to \${facultyEmail}\`);
      }
    });

    this.workers.set(complaintId, worker);
  }

  // Stop monitoring when complaint is responded to
  stopComplaintMonitor(complaintId) {
    const worker = this.workers.get(complaintId);
    if (worker) {
      worker.postMessage({ type: 'CANCEL' });
      worker.terminate();
      this.workers.delete(complaintId);
    }
  }
}`}
          </pre>
        </div>
      </section>

      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Express Custom Middleware</h2>
        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-slate-300">
{`// customMiddleware.js
// Authentication Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
};

// Rate Limiting Middleware
const rateLimiter = (maxRequests, windowMs) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    const requestTimestamps = requests.get(ip) || [];
    const recentRequests = requestTimestamps.filter(t => t > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ message: 'Too many requests' });
    }
    
    recentRequests.push(now);
    requests.set(ip, recentRequests);
    next();
  };
};

// Request Logging Middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.path} - \${res.statusCode} (\${duration}ms)\`);
  });
  next();
};`}
          </pre>
        </div>
      </section>

      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">MongoDB Aggregation Pipeline</h2>
        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-slate-300">
{`// complaints.js - Aggregation Pipeline for Statistics
router.get('/statistics', authMiddleware, async (req, res) => {
  const statistics = await Complaint.aggregate([
    // Stage 1: Match complaints (optionally filter by user)
    {
      $match: req.user.role === 'student' 
        ? { student: req.user._id } 
        : {}
    },
    // Stage 2: Group by status and count
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgResponseTime: { 
          $avg: { 
            $subtract: ['$respondedAt', '$createdAt'] 
          }
        }
      }
    },
    // Stage 3: Project to reshape output
    {
      $project: {
        status: '$_id',
        count: 1,
        avgResponseTimeHours: { 
          $divide: ['$avgResponseTime', 3600000] 
        }
      }
    },
    // Stage 4: Sort by count
    { $sort: { count: -1 } }
  ]);

  // Priority breakdown using facet
  const priorityStats = await Complaint.aggregate([
    {
      $facet: {
        byPriority: [
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ],
        byIssueType: [
          { $group: { _id: '$issue', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 }
        ]
      }
    }
  ]);

  res.json({ statistics, priorityStats });
});`}
          </pre>
        </div>
      </section>
    </div>
  )
}

function SetupSection() {
  return (
    <div className="space-y-6">
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Complete Setup Guide</h2>
        
        <div className="space-y-6">
          {/* Prerequisites */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Prerequisites</h3>
            <ul className="text-slate-300 space-y-1">
              <li>- Node.js 18+ installed</li>
              <li>- MongoDB installed locally or MongoDB Atlas account</li>
              <li>- npm or yarn package manager</li>
              <li>- Angular CLI: <code className="bg-slate-800 px-2 py-0.5 rounded">npm install -g @angular/cli</code></li>
            </ul>
          </div>

          {/* Step 1: Backend */}
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-400 mb-2">Step 1: Setup Backend</h3>
            <div className="bg-slate-900 rounded p-3 font-mono text-sm text-slate-300 space-y-1">
              <p># Navigate to backend folder</p>
              <p className="text-green-400">cd complaint-system/backend</p>
              <p className="mt-2"># Install dependencies</p>
              <p className="text-green-400">npm install</p>
              <p className="mt-2"># Create .env file</p>
              <p className="text-green-400">cp .env.example .env</p>
              <p className="mt-2"># Edit .env with your MongoDB URI and settings</p>
              <p className="text-yellow-400"># MONGODB_URI=mongodb://localhost:27017/complaint_system</p>
              <p className="text-yellow-400"># JWT_SECRET=your_secret_key</p>
              <p className="text-yellow-400"># EMAIL_USER=your_email@gmail.com</p>
              <p className="text-yellow-400"># EMAIL_PASS=your_app_password</p>
              <p className="mt-2"># Seed the database with test users</p>
              <p className="text-green-400">npm run seed</p>
              <p className="mt-2"># Start the server</p>
              <p className="text-green-400">npm run dev</p>
              <p className="text-slate-500 mt-2"># Server runs on http://localhost:5000</p>
            </div>
          </div>

          {/* Step 2: React */}
          <div className="bg-cyan-900/20 border border-cyan-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Step 2: Setup React Frontend</h3>
            <div className="bg-slate-900 rounded p-3 font-mono text-sm text-slate-300 space-y-1">
              <p># Open new terminal, navigate to react folder</p>
              <p className="text-cyan-400">cd complaint-system/react-frontend</p>
              <p className="mt-2"># Install dependencies</p>
              <p className="text-cyan-400">npm install</p>
              <p className="mt-2"># Start development server</p>
              <p className="text-cyan-400">npm run dev</p>
              <p className="text-slate-500 mt-2"># React app runs on http://localhost:5173</p>
            </div>
          </div>

          {/* Step 3: Angular */}
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Step 3: Setup Angular Frontend</h3>
            <div className="bg-slate-900 rounded p-3 font-mono text-sm text-slate-300 space-y-1">
              <p># Open new terminal, navigate to angular folder</p>
              <p className="text-red-400">cd complaint-system/angular-frontend</p>
              <p className="mt-2"># Install dependencies</p>
              <p className="text-red-400">npm install</p>
              <p className="mt-2"># Start development server</p>
              <p className="text-red-400">npm start</p>
              <p className="text-slate-500 mt-2"># Angular app runs on http://localhost:4200</p>
            </div>
          </div>

          {/* MongoDB Setup */}
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">MongoDB Setup Options</h3>
            <div className="space-y-3">
              <div>
                <p className="text-white font-medium">Option 1: Local MongoDB</p>
                <div className="bg-slate-900 rounded p-2 font-mono text-sm text-slate-300 mt-1">
                  <p># Install MongoDB Community Edition</p>
                  <p># Start MongoDB service</p>
                  <p className="text-yellow-400">mongod</p>
                </div>
              </div>
              <div>
                <p className="text-white font-medium">Option 2: MongoDB Atlas (Cloud)</p>
                <ol className="text-slate-300 text-sm mt-1 space-y-1 list-decimal list-inside">
                  <li>Go to mongodb.com/atlas</li>
                  <li>Create free cluster</li>
                  <li>Get connection string</li>
                  <li>Replace MONGODB_URI in .env</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">API Endpoints</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-2 text-slate-400">Method</th>
                <th className="text-left py-2 text-slate-400">Endpoint</th>
                <th className="text-left py-2 text-slate-400">Description</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2"><span className="bg-green-600 px-2 py-0.5 rounded text-xs">POST</span></td>
                <td className="py-2 font-mono">/api/auth/register</td>
                <td className="py-2">Register new user</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2"><span className="bg-green-600 px-2 py-0.5 rounded text-xs">POST</span></td>
                <td className="py-2 font-mono">/api/auth/login</td>
                <td className="py-2">Login user</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2"><span className="bg-blue-600 px-2 py-0.5 rounded text-xs">GET</span></td>
                <td className="py-2 font-mono">/api/complaints</td>
                <td className="py-2">Get all complaints</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2"><span className="bg-green-600 px-2 py-0.5 rounded text-xs">POST</span></td>
                <td className="py-2 font-mono">/api/complaints</td>
                <td className="py-2">Submit complaint</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2"><span className="bg-yellow-600 px-2 py-0.5 rounded text-xs">PUT</span></td>
                <td className="py-2 font-mono">/api/complaints/:id/respond</td>
                <td className="py-2">Respond to complaint</td>
              </tr>
              <tr>
                <td className="py-2"><span className="bg-blue-600 px-2 py-0.5 rounded text-xs">GET</span></td>
                <td className="py-2 font-mono">/api/complaints/statistics</td>
                <td className="py-2">Get statistics (Aggregation)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Download Instructions */}
      <section className="bg-blue-900/30 border border-blue-600 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Download the Project</h2>
        <p className="text-slate-300 mb-3">
          Click the three dots menu in the top right corner of this page and select "Download ZIP" to get all project files.
        </p>
        <p className="text-slate-400 text-sm">
          The downloaded ZIP contains the complete <code className="bg-slate-800 px-2 py-0.5 rounded">complaint-system</code> folder with backend, react-frontend, and angular-frontend directories.
        </p>
      </section>
    </div>
  )
}
