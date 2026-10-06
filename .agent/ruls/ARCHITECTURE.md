# OFFSCRIPT — SYSTEM ARCHITECTURE

## 1. Document Purpose

This document defines the technical architecture of OFFSCRIPT.

It describes:

* application layers
* frontend architecture
* backend architecture
* API communication
* authentication flow
* authorization flow
* database access
* business logic boundaries
* file storage
* state management
* caching
* security boundaries
* error handling
* testing architecture
* deployment architecture
* data flow
* feature implementation flow
* architectural rules

This document is the architectural source of truth for implementation.

---

# 2. Architecture Goals

OFFSCRIPT architecture must prioritize:

```text
Maintainability
Security
Scalability
Separation of concerns
Testability
Predictable data flow
Backend authority
Developer experience
Performance
```

The architecture must avoid unnecessary complexity while remaining production-ready.

---

# 3. High-Level Architecture

OFFSCRIPT uses a separated frontend/backend architecture.

```text
┌──────────────────────────────────────────────┐
│                  USER                        │
│             Browser / Mobile                 │
└──────────────────────┬───────────────────────┘
                       │
                       │ HTTPS
                       ↓
┌──────────────────────────────────────────────┐
│              NEXT.JS FRONTEND                │
│                                              │
│ React + JavaScript + JSX                     │
│ App Router                                   │
│ Tailwind CSS                                 │
│ shadcn/ui                                    │
│ TanStack Query                               │
│ Axios                                        │
└──────────────────────┬───────────────────────┘
                       │
                       │ REST API
                       ↓
┌──────────────────────────────────────────────┐
│              EXPRESS BACKEND                 │
│                                              │
│ Routes                                       │
│ Middleware                                   │
│ Validation                                   │
│ Controllers                                  │
│ Services                                     │
│ Authorization                                │
└──────────────────────┬───────────────────────┘
                       │
                       │ Prisma
                       ↓
┌──────────────────────────────────────────────┐
│               MONGODB ATLAS                  │
│                                              │
│ Users                                        │
│ Learning                                     │
│ Assignments                                  │
│ Projects                                     │
│ Competitions                                 │
│ Points                                       │
│ Badges                                       │
│ Notifications                                │
│ Audit data                                   │
└──────────────────────────────────────────────┘

                       │
                       │ File operations
                       ↓
┌──────────────────────────────────────────────┐
│               CLOUDFLARE R2                  │
│                                              │
│ User files                                   │
│ Project files                                │
│ Assignment files                             │
│ Competition submissions                      │
└──────────────────────────────────────────────┘
```

---

# 4. Application Architecture

The system is divided into two independently deployable applications:

```text
frontend/
backend/
```

Frontend:

```text
Next.js
```

Backend:

```text
Node.js
Express.js
```

Database:

```text
MongoDB Atlas
```

Storage:

```text
Cloudflare R2
```

---

# 5. Frontend Architecture

## 5.1 Frontend Stack

```text
Next.js
React
JavaScript
JSX
App Router
Tailwind CSS
shadcn/ui
Lucide React
Framer Motion
React Hook Form
Zod
TanStack Query
Axios
```

TypeScript is not used unless explicitly introduced as a future architectural decision.

---

# 6. Frontend Layer Structure

Frontend responsibilities are separated into:

```text
Page
 ↓
Component
 ↓
Hook
 ↓
API Client
 ↓
Backend
```

Example:

```text
DashboardPage
      ↓
Dashboard components
      ↓
useDashboard()
      ↓
dashboardApi.get()
      ↓
Axios
      ↓
Express API
```

---

# 7. Next.js App Router

The frontend uses the Next.js App Router.

Recommended structure:

```text
frontend/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   └── (member)/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── roadmap/
│   ├── sessions/
│   ├── assignments/
│   ├── projects/
│   ├── competitions/
│   ├── badges/
│   └── profile/
│
├── hooks/
│
├── lib/
│   ├── api/
│   ├── auth/
│   └── utils/
│
├── public/
│
└── styles/
```

---

# 8. Route Groups

Public pages:

```text
app/(public)/
```

Authentication pages:

```text
app/(auth)/
```

Authenticated member pages:

```text
app/(member)/
```

The route structure must remain readable and predictable.

---

# 9. Frontend Component Architecture

Components should be separated by responsibility.

### UI components

Reusable primitives:

```text
Button
Input
Select
Modal
Dialog
Card
Badge
Progress
Table
Dropdown
Toast
Skeleton
```

### Feature components

Domain-specific components:

```text
DashboardCard
RoadmapTimeline
SessionCard
AssignmentCard
ProjectCard
CompetitionCard
BadgeCard
PointsHistory
ProfileStats
```

Do not put business logic into generic UI components.

---

# 10. Frontend State Categories

OFFSCRIPT separates state into:

```text
Server State
UI State
Form State
Authentication State
Derived State
```

---

# 11. Server State

Server state is managed primarily through TanStack Query.

Examples:

```text
Dashboard data
Roadmap
Sessions
Assignments
Projects
Competitions
Badges
Points
Notifications
Profile
```

TanStack Query is responsible for:

```text
Fetching
Caching
Refetching
Loading states
Error states
Mutation states
Cache invalidation
```

---

# 12. UI State

Local React state should handle transient UI state.

Examples:

```text
Modal open/closed
Selected tab
Dropdown state
Sidebar state
Filter state
Temporary visual state
```

Do not store persistent server data in local state unnecessarily.

---

# 13. Form State

React Hook Form manages complex forms.

Zod provides validation.

Flow:

```text
User input
    ↓
React Hook Form
    ↓
Zod validation
    ↓
API request
    ↓
Backend validation
```

Frontend validation improves UX.

Backend validation provides actual security.

---

# 14. API Client Architecture

All API requests should go through a centralized Axios configuration.

Recommended:

```text
lib/api/client.js
```

Feature-specific API modules:

```text
lib/api/auth.js
lib/api/dashboard.js
lib/api/roadmap.js
lib/api/sessions.js
lib/api/assignments.js
lib/api/projects.js
lib/api/competitions.js
lib/api/badges.js
lib/api/points.js
lib/api/profile.js
```

Avoid scattered raw Axios calls throughout components.

---

# 15. API Request Flow

Standard request:

```text
Component
    ↓
Hook
    ↓
API module
    ↓
Axios client
    ↓
HTTP request
    ↓
Express
```

Example:

```text
DashboardPage
    ↓
useDashboard()
    ↓
dashboardApi.getDashboard()
    ↓
apiClient.get("/dashboard")
```

---

# 16. Backend Architecture

The backend follows a layered architecture:

```text
Request
  ↓
Route
  ↓
Middleware
  ↓
Authentication
  ↓
Authorization
  ↓
Validation
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
MongoDB
```

Each layer has a defined responsibility.

---

# 17. Backend Folder Structure

Recommended:

```text
backend/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── validators/
│   ├── config/
│   ├── utils/
│   ├── app.js
│   └── ...
│
├── prisma/
│   └── schema.prisma
│
├── tests/
│
└── server.js
```

---

# 18. Routes

Routes define:

```text
HTTP method
Endpoint
Middleware chain
Controller
```

Example:

```text
POST /api/sessions/:id/complete
```

Conceptually:

```text
Route
 ↓
authenticate
 ↓
authorize
 ↓
validate
 ↓
controller
```

Routes must remain thin.

---

# 19. Middleware

Middleware handles cross-cutting concerns.

Examples:

```text
Authentication
Authorization
Validation
Rate limiting
CORS
Security headers
Request logging
Error handling
```

Middleware must not contain large business workflows.

---

# 20. Authentication Boundary

Authentication determines:

```text
Who is the user?
```

Authorization determines:

```text
What can the user do?
```

These are separate responsibilities.

---

# 21. Authentication Flow

OFFSCRIPT uses:

```text
JWT
HTTP-only cookies
```

Flow:

```text
Login
 ↓
Validate credentials
 ↓
Verify password
 ↓
Create JWT
 ↓
Set secure HTTP-only cookie
 ↓
Return safe user information
```

The JWT must not be exposed to JavaScript through localStorage.

---

# 22. Protected Request Flow

```text
Browser
  ↓
HTTP request + cookie
  ↓
Express
  ↓
Authentication middleware
  ↓
Verify JWT
  ↓
Load/validate user
  ↓
Authorization
  ↓
Controller
```

---

# 23. Authorization Architecture

Authorization must be centralized.

Example:

```text
requireAuth
requireRole
requireOwnership
requirePermission
```

Business services must still verify critical authorization conditions where necessary.

Do not trust frontend visibility rules.

---

# 24. Ownership Architecture

Resources owned by users must be checked against authenticated identity.

Example:

```text
GET /api/projects/:id/submissions
```

must not automatically expose every member's submission.

The backend determines whether:

```text
request.user.id
```

may access:

```text
submission.userId
```

or whether the requester's role grants access.

---

# 25. IDOR Prevention

Every resource access must consider object-level authorization.

Bad:

```text
find submission by id
return submission
```

Correct conceptual flow:

```text
Authenticate user
      ↓
Find resource
      ↓
Verify ownership/permission
      ↓
Return resource
```

This applies to:

```text
Submissions
Files
Profiles
Points
Notifications
Progress
Competition data
```

---

# 26. Validation Architecture

Use Zod at API boundaries.

Flow:

```text
HTTP Request
      ↓
Zod Schema
      ↓
Validated Input
      ↓
Controller
      ↓
Service
```

Validation must cover:

```text
Body
Params
Query
```

depending on the endpoint.

---

# 27. Controller Responsibilities

Controllers should:

```text
Read request
Validate/use validated data
Call service
Return HTTP response
Handle expected application errors
```

Controllers should not contain large business algorithms.

Avoid:

```text
500+ line controllers
```

---

# 28. Service Responsibilities

Services contain business logic.

Examples:

```text
authService
userService
roadmapService
sessionService
assignmentService
projectService
competitionService
badgeService
pointsService
notificationService
fileService
```

Services determine:

```text
Eligibility
State transitions
Rewards
Progress
Ownership rules
Business constraints
```

---

# 29. Prisma Boundary

Prisma should primarily be accessed from the service/data-access layer.

Conceptual flow:

```text
Controller
    ↓
Service
    ↓
Prisma
    ↓
MongoDB
```

Avoid direct Prisma queries scattered across route handlers.

---

# 30. Database Architecture

Database:

```text
MongoDB Atlas
```

ORM:

```text
Prisma
```

No Mongoose.

The database model is defined by:

```text
DATA-MODEL.md
```

and implemented in:

```text
backend/prisma/schema.prisma
```

---

# 31. Database Source of Truth

The database is authoritative for:

```text
Users
Roles
Permissions
Progress
Submissions
Competition registration
Competition state
Points
Badges
Notifications
Audit records
```

The frontend can cache these values but cannot define them.

---

# 32. Points Architecture

Points follow:

```text
Business Event
      ↓
Reward Rule
      ↓
Point Transaction
      ↓
User Points
      ↓
Dashboard / Points History
```

Example:

```text
Session completed
      ↓
Validate completion
      ↓
Check reward rule
      ↓
Create PointTransaction
      ↓
Update/recalculate balance
      ↓
Invalidate dashboard cache
```

Reward operations must be idempotent.

---

# 33. Progress Architecture

Progress follows real persisted events.

Example:

```text
Session completion
      ↓
SessionProgress
      ↓
Roadmap calculation
      ↓
Dashboard
```

The frontend must not independently decide that a session is completed.

---

# 34. Badge Architecture

Badge evaluation occurs after relevant events.

Example:

```text
Project approved
      ↓
Badge service
      ↓
Evaluate requirements
      ↓
Create UserBadge
      ↓
Optional reward
      ↓
Notification
```

Badge unlocking must be idempotent.

---

# 35. Assignment Architecture

```text
Assignment
     ↓
Member starts
     ↓
Submission
     ↓
Review
     ↓
Approved / Rejected
     ↓
Reward + progress + badges
```

The backend controls every state transition.

---

# 36. Project Architecture

```text
Project
   ↓
ProjectProgress
   ↓
Submission
   ↓
Review
   ↓
Approved / Rejected
   ↓
Rewards
   ↓
Badges
```

---

# 37. Competition Architecture

```text
Competition
     ↓
Eligibility
     ↓
Registration
     ↓
Active Competition
     ↓
Submission
     ↓
Evaluation
     ↓
Completion
     ↓
Rewards / Badges
```

Registration must be idempotent.

---

# 38. File Architecture

Files are not stored directly in MongoDB.

Architecture:

```text
Frontend
   ↓
Backend
   ↓
Validate file
   ↓
Cloudflare R2
   ↓
Store metadata in MongoDB
```

MongoDB stores:

```text
storageKey
owner
filename
mimeType
size
metadata
```

R2 stores the actual object.

---

# 39. File Security

Every upload must validate:

```text
File type
MIME type
File size
Extension
Ownership
Destination
```

Do not trust the filename or MIME type supplied by the client.

Private files require authorization before access.

---

# 40. Notification Architecture

Notifications are created by backend events.

Examples:

```text
Assignment reviewed
Project reviewed
Badge earned
Points awarded
Competition event
System announcement
```

Flow:

```text
Business event
      ↓
Notification service
      ↓
Notification document
      ↓
Frontend query
      ↓
Notification UI
```

---

# 41. Audit Architecture

Audit logging is separate from user-facing activity.

```text
Activity
    =
user-facing product history

AuditLog
    =
security/admin traceability
```

Examples of audit events:

```text
User suspended
Reward changed
Points manually awarded
Competition modified
Admin content change
```

Audit records should be difficult to alter and should never contain secrets.

---

# 42. Activity Architecture

User-facing activity can include:

```text
Session completed
Assignment approved
Project completed
Badge earned
Competition joined
Points earned
```

Activity should be generated from real backend events.

---

# 43. Error Architecture

The backend must use consistent application errors.

Conceptual response:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource not found."
  }
}
```

Do not expose:

```text
Database stack traces
Internal file paths
Secrets
Prisma internals
Sensitive implementation details
```

---

# 44. Error Flow

```text
Service error
      ↓
Application error
      ↓
Express error middleware
      ↓
Stable API response
      ↓
Axios
      ↓
TanStack Query
      ↓
UI error state
```

---

# 45. Loading / Empty / Error / Success Architecture

Every data-driven feature should explicitly support:

```text
Loading
Success
Empty
Error
```

Example:

```text
useProjects()
      ↓
LOADING
      ↓
SUCCESS / EMPTY / ERROR
```

Avoid blank screens.

---

# 46. Caching Architecture

TanStack Query handles frontend server-state caching.

Caching must not replace backend authority.

Example:

```text
Cached dashboard
      ↓
User completes session
      ↓
Mutation succeeds
      ↓
Invalidate affected queries
      ↓
Fetch updated data
```

---

# 47. Optimistic Updates

Optimistic updates may be used only when rollback is reliable.

Suitable examples:

```text
Mark notification as read
```

Potentially risky examples:

```text
Award points
Complete session
Submit competition
Approve project
```

For critical business operations, wait for backend confirmation.

---

# 48. API Cache Invalidation

After mutations, invalidate related server state.

Example:

```text
Complete Session
      ↓
Invalidate:
- session progress
- roadmap
- dashboard
- points
- badges
- notifications
```

Only invalidate what is actually affected.

---

# 49. Authentication State Synchronization

Frontend authentication state must remain synchronized with backend state.

Important events:

```text
Login
Logout
Session expiration
Account suspension
Password reset
```

After logout:

```text
Clear client auth state
Clear sensitive cached queries
Redirect
Prevent protected access
Recheck authentication after browser navigation
```

---

# 50. Logout Architecture

Logout must be a real backend operation.

Flow:

```text
User clicks Logout
      ↓
Confirmation if required
      ↓
POST /api/auth/logout
      ↓
Clear HTTP-only cookie
      ↓
Clear client state/cache
      ↓
Redirect to public page
```

The UI must not treat a local redirect as sufficient logout.

---

# 51. Browser Back Protection

After logout:

```text
Protected route
      ↓
Authentication check
      ↓
Unauthenticated
      ↓
Redirect to login/public page
```

Previously rendered protected content must not become accessible merely through browser history.

---

# 52. Security Architecture

Security layers include:

```text
HTTPS
HTTP-only cookies
JWT
Argon2id
RBAC
Ownership checks
Zod validation
Helmet
Explicit CORS
Rate limiting
Secure headers
Input validation
File validation
Audit logging
```

Security must be implemented server-side.

---

# 53. CORS

CORS must explicitly allow trusted frontend origins.

Do not use unrestricted:

```text
*
```

for authenticated production traffic.

Credentialed requests require deliberate CORS configuration.

---

# 54. Rate Limiting

Rate limiting should protect sensitive endpoints.

Especially:

```text
Login
Register
Forgot password
Reset password
Potentially expensive APIs
File operations
```

Limits should be configured according to expected traffic.

---

# 55. Environment Configuration

Secrets must be provided through environment variables.

Example:

```text
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
FRONTEND_URL
R2_ENDPOINT
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET
```

Never commit production secrets.

Provide:

```text
.env.example
```

without secret values.

---

# 56. Request Lifecycle

Standard API lifecycle:

```text
HTTP Request
     ↓
CORS
     ↓
Security Headers
     ↓
Rate Limit
     ↓
Route
     ↓
Authentication
     ↓
Authorization
     ↓
Validation
     ↓
Controller
     ↓
Service
     ↓
Prisma
     ↓
MongoDB
     ↓
Service Result
     ↓
Controller Response
     ↓
HTTP Response
```

---

# 57. Feature Implementation Architecture

Every feature should be traced end-to-end.

Required trace:

```text
UI
 ↓
Page
 ↓
Component
 ↓
Hook
 ↓
API Client
 ↓
Route
 ↓
Middleware
 ↓
Controller
 ↓
Service
 ↓
Prisma
 ↓
MongoDB
```

Then back:

```text
MongoDB
 ↓
Service
 ↓
Controller
 ↓
API Response
 ↓
TanStack Query
 ↓
Component
 ↓
UI
```

---

# 58. Example — Complete Session

```text
User clicks "Complete Session"
        ↓
Frontend handler
        ↓
sessionApi.complete()
        ↓
POST /api/sessions/:id/complete
        ↓
authenticate
        ↓
authorize
        ↓
validate session ID
        ↓
sessionController
        ↓
sessionService.complete()
        ↓
Verify session exists
        ↓
Verify user can access session
        ↓
Check existing completion
        ↓
Create/update SessionProgress
        ↓
Apply reward rule
        ↓
Create PointTransaction if eligible
        ↓
Evaluate badges
        ↓
Create notification if required
        ↓
Return result
        ↓
Invalidate affected frontend queries
        ↓
Dashboard / Roadmap / Points / Badges update
```

The entire operation must be idempotent.

---

# 59. Example — Assignment Submission

```text
Submit Assignment
        ↓
React Hook Form
        ↓
Zod validation
        ↓
API client
        ↓
POST /api/assignments/:id/submissions
        ↓
Authentication
        ↓
Authorization
        ↓
Backend validation
        ↓
Assignment service
        ↓
Check assignment state
        ↓
Check user eligibility
        ↓
Check attempts/deadline
        ↓
Create submission
        ↓
Return submission
        ↓
Invalidate assignment queries
```

---

# 60. Example — Competition Registration

```text
Register
   ↓
POST /api/competitions/:id/register
   ↓
Authenticate
   ↓
Authorize
   ↓
Validate
   ↓
Check competition state
   ↓
Check registration window
   ↓
Check eligibility
   ↓
Check duplicate registration
   ↓
Create registration
   ↓
Notification if required
   ↓
Return result
```

Database uniqueness must protect against concurrent duplicate requests.

---

# 61. Example — Project Approval

```text
Admin approves project
        ↓
Authorization
        ↓
Validate submission
        ↓
Project service
        ↓
Update submission
        ↓
Update project progress
        ↓
Award configured points
        ↓
Evaluate badges
        ↓
Create notification
        ↓
Audit action
        ↓
Return response
```

This is a multi-record business operation and must have a deliberate consistency strategy.

---

# 62. Admin Architecture

Admin functionality must remain separated from member functionality.

Admin capabilities may include:

```text
Manage users
Manage roadmap
Manage sessions
Manage assignments
Manage projects
Manage competitions
Manage badges
Configure rewards
Award points
Review submissions
View audit information
```

Every admin action requires backend authorization.

---

# 63. Member Architecture

Members can:

```text
View roadmap
Access available sessions
Complete sessions
Submit assignments
Work on projects
Register for competitions
Submit competitions
View badges
View points
Manage profile
View notifications
```

Actual permissions are defined by `AUTH.md` and `FEATURES.md`.

---

# 64. Data Ownership Model

The architecture distinguishes:

```text
Global content
```

from:

```text
Member-owned activity
```

Global content:

```text
Semester
Week
Session
Assignment
Project
Competition
Badge
RewardRule
```

Member activity:

```text
SessionProgress
AssignmentSubmission
ProjectProgress
ProjectSubmission
CompetitionRegistration
CompetitionSubmission
UserBadge
PointTransaction
Notification
```

This separation simplifies authorization and lifecycle management.

---

# 65. API Resource Boundaries

Each domain should have clear boundaries.

```text
/auth
/users
/dashboard
/roadmap
/sessions
/assignments
/projects
/competitions
/badges
/points
/profile
/notifications
/files
/admin
```

Avoid generic endpoints that expose unrelated internal data.

---

# 66. Dependency Direction

Dependencies should flow inward toward business logic.

Recommended:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Database / external providers
```

Avoid:

```text
Database → Controller
Component → Prisma
Component → MongoDB
```

The frontend must never directly access MongoDB.

---

# 67. External Services

External providers include:

```text
MongoDB Atlas
Cloudflare R2
Vercel
Railway
```

External integrations must be isolated behind services/configuration where practical.

Do not spread provider-specific code throughout the application.

---

# 68. Logging

Backend logging should distinguish:

```text
Application logs
Security logs
Audit logs
Error logs
```

Do not log:

```text
Passwords
JWT secrets
Private tokens
Sensitive credentials
```

Structured logging should be used for production diagnostics.

---

# 69. Observability

Production monitoring should track:

```text
API errors
Response latency
Authentication failures
Database failures
File upload failures
Critical business operation failures
```

Critical workflows should generate sufficient logs for diagnosis without exposing sensitive data.

---

# 70. Testing Architecture

Testing is divided into:

```text
Unit Tests
Integration Tests
End-to-End Tests
```

---

## Unit

Vitest:

```text
Services
Business rules
Validators
Utility functions
Reward calculations
Badge evaluation
State transitions
```

---

## Integration

Supertest:

```text
Authentication
Authorization
API endpoints
Database interaction
Ownership checks
Idempotency
Error handling
```

---

## E2E

Playwright:

```text
Register
Login
Logout
Protected routes
Roadmap
Session completion
Assignment submission
Project submission
Competition registration
Points
Badges
Profile
```

---

# 71. Critical Test Principle

Testing must validate the complete business flow.

Not only:

```text
Button renders
```

but:

```text
Button
 ↓
API
 ↓
Authorization
 ↓
Validation
 ↓
Business logic
 ↓
Database
 ↓
Response
 ↓
UI update
```

---

# 72. Performance Architecture

Frontend:

```text
Next.js rendering strategy
TanStack Query caching
Code splitting
Lazy loading where appropriate
Optimized images
Minimal unnecessary client components
```

Backend:

```text
Pagination
Indexes
Efficient Prisma queries
Limited payloads
Avoid unnecessary database queries
```

Database:

```text
Proper indexes
Controlled document size
Avoid unnecessary denormalization
```

---

# 73. Mobile Architecture

Responsive behavior is part of the architecture.

The application must support:

```text
Desktop
Tablet
Mobile
```

No critical workflow should depend on hover.

No page should create horizontal overflow.

---

# 74. Accessibility Architecture

Interactive components must support:

```text
Keyboard navigation
Visible focus
Semantic HTML
Accessible labels
Readable contrast
Screen-reader compatible controls
```

Accessibility must be considered at component level, not only at page level.

---

# 75. UI Architecture

The visual system follows:

```text
Dark
Red
Technical
Premium
Competitive
Clean
```

The design system is defined in:

```text
UI-UX.md
```

Architecture must not introduce visual patterns that contradict that document.

---

# 76. Animation Architecture

Framer Motion may be used for:

```text
Page transitions
Subtle entrance animation
Progress feedback
Modal transitions
Micro-interactions
```

Avoid:

```text
Excessive animation
Long loading animations
Distracting effects
Animation that blocks interaction
```

---

# 77. Source of Truth Rules

### Authentication

Backend.

### Authorization

Backend.

### Points

Point ledger/backend.

### Progress

Persisted backend state.

### Badges

Backend evaluation.

### Competition status

Backend.

### Submission status

Backend.

### Reward values

Backend configuration.

### UI

Presentation only.

---

# 78. Architectural Anti-Patterns

Never:

```text
❌ Connect frontend directly to MongoDB
❌ Put Prisma queries in React components
❌ Store JWT in localStorage
❌ Trust frontend roles
❌ Trust frontend points
❌ Hard-code reward values in UI
❌ Put business logic in generic components
❌ Put large business logic in routes
❌ Create huge controllers
❌ Duplicate authorization logic everywhere
❌ Return unrestricted database documents
❌ Expose stack traces
❌ Store secrets in Git
❌ Use Mongoose
❌ Create unnecessary abstraction layers
```

---

# 79. AI Coding Architecture Rules

AI coding agents must follow:

```text
Understand
    ↓
Inspect
    ↓
Plan
    ↓
Implement
    ↓
Test
    ↓
Verify
    ↓
Report
```

Before modifying architecture, the agent must inspect the existing implementation.

Never blindly create duplicate:

```text
routes
controllers
services
hooks
API clients
models
utilities
```

---

# 80. Bug-Fixing Architecture Workflow

For every bug:

```text
1. Explain what the error means
2. Identify root cause
3. Locate the exact file/function/component
4. Identify possible solutions
5. Explain trade-offs
6. Choose the best solution
7. Implement
8. Run relevant tests
9. Verify regression
```

Do not patch symptoms without understanding the architecture.

---

# 81. Feature Development Workflow

Every new feature should follow:

```text
Requirement
    ↓
FEATURES.md
    ↓
DATA-MODEL.md
    ↓
API contract
    ↓
Backend service
    ↓
Backend tests
    ↓
Frontend API layer
    ↓
Frontend hook
    ↓
UI components
    ↓
E2E test
    ↓
Regression verification
```

---

# 82. Change Impact Analysis

Before modifying an existing feature, inspect:

```text
UI
API client
Hook
Route
Middleware
Controller
Service
Prisma model
Database relationships
Tests
```

Then identify dependent features.

Example:

Changing Points can affect:

```text
Dashboard
Profile
Badges
Notifications
Activity
Admin
```

---

# 83. Contract Consistency

The following documents must remain consistent:

```text
SKILLS.md
TECH-STACK.md
API.md
AUTH.md
FEATURES.md
UI-UX.md
DATA-MODEL.md
ARCHITECTURE.md
```

If one contract changes, dependent documents must be reviewed.

---

# 84. Deployment Architecture

Production:

```text
                  INTERNET
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
      VERCEL                  RAILWAY
    Next.js App            Express API
                                │
                                ↓
                         MongoDB Atlas
                                │
                                ↓
                         Cloudflare R2
```

---

# 85. Frontend Deployment

Next.js is deployed on:

```text
Vercel
```

Environment variables configure the backend API URL and public configuration.

No private backend secrets are exposed to the browser.

---

# 86. Backend Deployment

Express is deployed on:

```text
Railway
```

Environment variables provide:

```text
Database credentials
JWT secret
R2 credentials
CORS origin
Other server configuration
```

---

# 87. Production Environment

Production must use:

```text
HTTPS
Secure cookies
Production database
Production storage
Explicit CORS
Production secrets
Rate limiting
Error-safe responses
Logging
Backups
```

---

# 88. Development Environment

Development may use:

```text
Local Next.js
Local Express
MongoDB Atlas development database
Development R2 bucket
Development environment variables
```

Development credentials must not be reused for production.

---

# 89. CI/CD Architecture

A production-quality pipeline should validate:

```text
Install
 ↓
Lint
 ↓
Unit tests
 ↓
Integration tests
 ↓
Build
 ↓
E2E where configured
 ↓
Deployment
```

A failed critical test should block deployment.

---

# 90. Git Architecture

Before committing:

```text
git diff
git status
tests
lint
build
secret scan
```

Do not commit:

```text
.env
credentials
private keys
node_modules
build artifacts
```

---

# 91. Scalability Strategy

OFFSCRIPT should scale through:

```text
Stateless API design
Horizontal backend scaling
MongoDB Atlas
Indexed queries
Pagination
Caching
Object storage
Background processing when needed
```

Avoid premature microservices.

The initial architecture should remain a modular monolith.

---

# 92. Modular Monolith

The Express backend is intentionally a modular monolith.

Domains are separated logically:

```text
Auth
Users
Roadmap
Sessions
Assignments
Projects
Competitions
Badges
Points
Notifications
Files
Admin
```

They share one backend deployment and one database.

This provides simpler development while maintaining clear boundaries.

---

# 93. When to Introduce Additional Services

Separate services should only be considered when there is a real requirement such as:

```text
High-scale background processing
Independent scaling requirement
External integration isolation
Long-running jobs
Real-time infrastructure
```

Do not introduce microservices merely for architectural appearance.

---

# 94. Real-Time Features

Real-time communication is not required for the initial core architecture.

If later introduced, isolate it behind a dedicated communication layer.

Possible future technologies:

```text
WebSocket
Socket.IO
Server-Sent Events
```

The choice must be based on an actual product requirement.

---

# 95. Background Jobs

Background processing may later be introduced for:

```text
Notifications
Email
Large file processing
Badge recalculation
Analytics
Scheduled competition transitions
```

The initial implementation should not add a queue unless required.

---

# 96. Scheduled Operations

Time-based business rules may require scheduled jobs.

Examples:

```text
Competition state transitions
Assignment deadline processing
Notifications
Maintenance tasks
Data cleanup
```

Scheduled operations must not become the only mechanism for enforcing state correctness.

The API must still validate current state when users perform actions.

---

# 97. Transactional Business Operations

Use transactions/consistency mechanisms when one business action changes multiple persistent records.

Example:

```text
Project approval
 ├── Submission
 ├── Progress
 ├── Points
 ├── Badge
 ├── Notification
 └── Audit
```

The exact transaction boundary must be defined by the service.

---

# 98. Idempotent Business Operations

The following should be designed for idempotency:

```text
Session completion
Assignment reward
Project reward
Competition registration
Badge unlock
Point award
Notification creation where applicable
```

Repeated requests must not accidentally duplicate business outcomes.

---

# 99. Architectural Quality Gates

Before declaring a feature complete:

```text
[ ] Architecture respected
[ ] Backend remains authoritative
[ ] Authorization verified
[ ] Ownership verified
[ ] Validation implemented
[ ] Database constraints reviewed
[ ] Idempotency reviewed
[ ] Error handling implemented
[ ] Loading state implemented
[ ] Empty state implemented
[ ] Success state implemented
[ ] Mobile behavior verified
[ ] Tests added
[ ] Regression tests passed
[ ] Build passes
[ ] No secrets committed
```

---

# 100. Final Architecture Contract

OFFSCRIPT follows this architecture:

```text
                         USER
                          │
                          ↓
                    NEXT.JS APP
                          │
                 TanStack Query
                          │
                        Axios
                          │
                    HTTPS / REST
                          │
                          ↓
                    EXPRESS API
                          │
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
 Authentication     Authorization       Validation
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ↓
                     Controllers
                          ↓
                       Services
                          ↓
                       Prisma
                          ↓
                    MongoDB Atlas
                          │
                          │
                          └──────→ Cloudflare R2
```

The fundamental architectural rule is:

```text
UI presents state.
API transports state.
Services enforce business rules.
Prisma accesses data.
MongoDB persists authoritative state.
R2 stores files.
```

The frontend must never bypass the backend.

The backend must never trust the frontend.

Business logic must remain testable and centralized.

Critical operations must be authorized, validated, idempotent, and traceable.

---

# 101. Implementation Order

After this architecture contract, implementation should proceed in this order:

```text
01. Prisma schema
        ↓
02. Database setup
        ↓
03. Express application foundation
        ↓
04. Authentication
        ↓
05. Authorization
        ↓
06. Core API infrastructure
        ↓
07. Learning domain
        ↓
08. Assignments
        ↓
09. Projects
        ↓
10. Competitions
        ↓
11. Points
        ↓
12. Badges
        ↓
13. Notifications
        ↓
14. Files
        ↓
15. Admin
        ↓
16. Frontend API integration
        ↓
17. Member pages
        ↓
18. E2E critical flows
        ↓
19. Security hardening
        ↓
20. Production deployment
```

---

# 102. Final Rule

Do not begin large-scale feature implementation by writing UI first.

For every important feature, understand:

```text
Data
 ↓
Business rules
 ↓
API
 ↓
Authorization
 ↓
Service
 ↓
UI
```

Then implement and test the complete flow.

OFFSCRIPT is a backend-authoritative modular monolith with a Next.js frontend, Express REST API, Prisma data layer, MongoDB Atlas database, and Cloudflare R2 object storage.
