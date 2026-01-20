# STEM CS Club - Certificate Verification System

Secure certificate verification system built with Next.js, MongoDB, and modern web technologies.

## 🌐 Live Demo

Visit: [Your Vercel URL]

## ✨ Features

- 🔍 Certificate verification by ID
- 🎨 Modern UI matching STEM CS Club branding
- 🔐 Secure admin dashboard
- 📊 Certificate management & analytics
- 📁 Secure file storage with random IDs
- 🗄️ MongoDB integration
- 🚀 One-command deployment

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Visit http://localhost:3000

### Admin Access

- URL: http://localhost:3000/admin
- Default credentials in `.env.local` (⚠️ change immediately!)

## 📦 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** MongoDB Atlas
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Authentication:** JWT
- **Deployment:** Vercel

## 🔧 Configuration

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

## 📁 Project Structure

```
certificates/
├── server/
│   ├── models/
│   │   ├── Certificate.js          # Certificate schema
│   │   ├── Admin.js                # Admin user schema
│   │   └── AuditLog.js             # Audit logging schema
│   ├── routes/
│   │   ├── certificates.js         # Public certificate routes
│   │   ├── admin.js                # Admin management routes
│   │   └── auth.js                 # Authentication routes
│   ├── middleware/
│   │   ├── auth.js                 # JWT authentication
│   │   ├── validation.js           # Input validation
│   │   └── errorHandler.js         # Global error handler
│   └── index.js                    # Express server entry
├── src/
│   ├── app/
│   │   ├── layout.js               # Root layout
│   │   ├── page.js                 # Home page
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── Navbar.js               # Navigation bar
│   │   ├── Footer.js               # Footer
│   │   └── CertificateVerifier.js  # Main verifier component
│   └── lib/
│       └── api.js                  # API client configuration
├── .env.local                      # Environment variables
├── next.config.js                  # Next.js configuration
├── tailwind.config.js              # Tailwind CSS config
├── postcss.config.js               # PostCSS config
├── package.json                    # Project dependencies
└── README.md                        # This file
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB 4.4+ (local or Atlas)
- npm or yarn

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

Edit `.env.local` with your settings:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/stem-certificates

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars-change-in-prod

# Server
PORT=3001
FRONTEND_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 3: Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env.local
```

### Step 4: Run Development Servers

```bash
# Terminal 1: Frontend (Next.js)
npm run dev

# Terminal 2: Backend (Express)
npm run server:dev

# Or run both concurrently:
npm run dev:all
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## 📡 API Endpoints

### Public Endpoints

#### Verify Certificate
```http
GET /api/certificates/verify/:certificateId
```

**Response:**
```json
{
  "verified": true,
  "certificate": {
    "certificateId": "2501001",
    "recipientName": "Ahmed Hassan",
    "program": "Web Development",
    "awardDate": "2025-01-15T00:00:00Z",
    "verificationCount": 5
  }
}
```

#### Check Certificate Existence
```http
GET /api/certificates/check/:certificateId
```

#### Search Certificates
```http
GET /api/certificates/search?program=Web%20Development
```

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "secure-password"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "...",
    "username": "admin",
    "role": "admin",
    "permissions": {...}
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

### Admin Endpoints (Protected)

#### Create Certificate
```http
POST /api/admin/certificates
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "certificateId": "2501001",
  "recipientName": "Ahmed Hassan",
  "recipientEmail": "ahmed@example.com",
  "program": "Web Development",
  "programCategory": "01",
  "awardDate": "2025-01-15",
  "notes": "Completed with distinction"
}
```

#### Get All Certificates
```http
GET /api/admin/certificates?page=1&limit=20
Authorization: Bearer <accessToken>
```

#### Update Certificate
```http
PUT /api/admin/certificates/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "recipientName": "New Name",
  "awardDate": "2025-01-20"
}
```

#### Revoke Certificate
```http
POST /api/admin/certificates/:id/revoke
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "reason": "Certificate holder requested revocation"
}
```

#### Get Analytics
```http
GET /api/admin/analytics
Authorization: Bearer <accessToken>
```

#### Get Audit Logs
```http
GET /api/admin/audit-logs?action=CREATE&page=1&limit=20
Authorization: Bearer <accessToken>
```

## 🔐 Security Measures

### 1. Authentication & Authorization
- JWT-based stateless authentication
- Role-based access control (RBAC)
- Permission-based system for granular control
- Account locking after 5 failed login attempts
- Login tracking with IP addresses

### 2. Input Validation
- Express-validator for request validation
- Zod for schema validation
- Input sanitization (HTML tag removal)
- Length limits on all string inputs
- Format validation for emails, certificates IDs, etc.

### 3. Rate Limiting
- 100 requests per 15 minutes per IP (global)
- 5 authentication attempts per 15 minutes (stricter)
- Configurable limits via environment variables
- Automatic IP blocking after threshold

### 4. Password Security
- Bcrypt hashing with 12 salt rounds
- Minimum 8 characters
- Complexity requirements (uppercase, lowercase, number, special char)
- Change password functionality
- No password in responses

### 5. Database Security
- MongoDB connection authentication
- Mongoose schema validation
- Index-based query optimization
- No sensitive data in logs
- Audit trail for all operations

### 6. HTTP Security
- Helmet.js security headers
- CORS whitelist enforcement
- HTTPS-ready configuration
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection enabled

### 7. Fraud Detection
- IP tracking for certificate verifications
- Unusual activity detection (ready for implementation)
- Failed verification logging
- Certificate revocation support
- Duplicate certificate prevention

### 8. Data Privacy
- No email enumeration attacks
- Limited search results (20 max)
- Sensitive fields removed from responses
- Audit log tracking of all accesses
- GDPR-compliant data handling

## 🗄️ Database Schema

### Certificate
```javascript
{
  certificateId: String (unique, indexed),
  recipientName: String,
  recipientEmail: String (indexed),
  program: String (enum),
  programCategory: String,
  awardDate: Date,
  verificationHash: String (unique),
  isVerified: Boolean,
  verificationCount: Number,
  lastVerifiedAt: Date,
  isRevoked: Boolean,
  revokedAt: Date,
  revocationReason: String,
  ipAddresses: [{ ip, verifiedAt }],
  createdAt: Date,
  updatedAt: Date
}
```

### Admin
```javascript
{
  username: String (unique),
  email: String (unique),
  passwordHash: String,
  fullName: String,
  role: String (enum: super_admin, admin, moderator, viewer),
  permissions: {
    canCreateCertificates: Boolean,
    canEditCertificates: Boolean,
    canDeleteCertificates: Boolean,
    canRevokeCertificates: Boolean,
    canViewAnalytics: Boolean,
    canManageAdmins: Boolean
  },
  isActive: Boolean,
  lastLogin: Date,
  loginAttempts: { count, lastAttemptAt },
  createdAt: Date,
  updatedAt: Date
}
```

### AuditLog
```javascript
{
  action: String (enum: CREATE, READ, UPDATE, DELETE, VERIFY, REVOKE, LOGIN, LOGOUT),
  entityType: String (enum: CERTIFICATE, ADMIN, USER),
  entityId: String,
  performedBy: ObjectId (ref: Admin),
  ipAddress: String,
  userAgent: String,
  status: String (enum: SUCCESS, FAILED),
  details: Mixed,
  errorMessage: String,
  changes: { before, after },
  createdAt: Date
}
```

## 🚀 Deployment

### Production Checklist

- [ ] Update `.env.local` with production values
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas with encryption
- [ ] Enable HTTPS/SSL certificates
- [ ] Set strong JWT_SECRET (32+ random characters)
- [ ] Configure CORS_ORIGIN with your domain
- [ ] Enable rate limiting
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Enable database backups
- [ ] Configure email for admin notifications
- [ ] Set up monitoring and alerts
- [ ] Enable 2FA for admin accounts

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3000 3001
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t stem-certificates .
docker run -p 3000:3000 -p 3001:3001 --env-file .env.local stem-certificates
```

## 📊 Testing

### Manual Testing

1. **Certificate Verification**
   - Test with valid certificate ID: `2501001`
   - Test with invalid format
   - Test with non-existent ID
   - Test with revoked certificate

2. **Admin Login**
   - Test with correct credentials
   - Test with incorrect password (check account lock)
   - Test token refresh
   - Test permission checks

3. **Security**
   - Test rate limiting (>100 requests in 15 min)
   - Test CORS headers
   - Test SQL injection prevention
   - Test XSS prevention

### Automated Testing (Future)

```bash
npm install --save-dev jest supertest
npm run test
```

## 🔄 Maintenance

### Regular Tasks

1. **Daily**
   - Monitor error logs
   - Check audit logs for suspicious activity
   - Verify database backups

2. **Weekly**
   - Review analytics
   - Check failed verification attempts
   - Update security patches

3. **Monthly**
   - Rotate JWT_SECRET
   - Review admin permissions
   - Clean up old audit logs
   - Database optimization

## 📖 Documentation

### User Guide
- Certificate verification process
- Troubleshooting common issues
- Sharing and exporting certificates

### Admin Guide
- Dashboard overview
- Certificate management
- User management
- Analytics interpretation
- Audit log reading

### Developer Guide
- API documentation
- Database schema
- Authentication flow
- Security implementation
- Deployment procedures

## � Troubleshooting

### MongoDB Connection Failed
```bash
# Verify connection string in .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/certificates
```

### Port Already in Use
```bash
# Change port or kill existing process
# On Windows: netstat -ano | findstr :3000
# On macOS/Linux: lsof -i :3000
```

### JWT Token Issues
- Re-login to get new token
- Verify JWT_SECRET in .env.local matches

## 📞 Support

- **Email**: csse@stemegypt.edu.eg
- **Discord**: https://discord.gg/bhNm7jc7js
- **Website**: https://www.stemcsclub.org

## 📄 License

© 2026 STEM Computer Science Club. All rights reserved.

