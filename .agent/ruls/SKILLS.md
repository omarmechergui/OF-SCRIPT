# OFFSCRIPT — SKILLS.md

## 1. Purpose

This file is the master development instruction set for the OFFSCRIPT platform.

Every AI coding agent, developer, or automated coding workflow must follow these rules when working on the project.

This document must remain consistent with:

* `TECH-STACK.md`
* `ARCHITECTURE.md`
* `API.md`
* `AUTH.md`
* `FEATURES.md`
* `UI-UX.md`
* `DATABASE.md`

If a conflict exists between implementation and these documents, stop and resolve the inconsistency before continuing.

---

# 2. Product Identity

OFFSCRIPT is a modern learning and competitive development platform.

The product combines:

* Structured learning
* Roadmaps
* Sessions
* Assignments
* Projects
* Competitions
* Badges
* Points
* Progress tracking
* Member profiles
* Admin-managed content
* Competitive motivation

The platform must feel:

* Technical
* Premium
* Professional
* Competitive
* Clean
* Modern
* Focused
* Developer-oriented

It must never feel childish or like a generic gamification dashboard.

---

# 3. Core Development Principle

Build real product functionality.

Do not build:

* Fake interactions
* Hard-coded business data
* Fake API responses
* Placeholder buttons presented as functional
* Static progress pretending to be dynamic
* Frontend-only authorization
* Frontend-only points
* Fake completion states
* Fake badges
* Fake competition registration
* Fake submissions
* Dead code
* Unused architecture introduced without purpose

Every important interaction must connect to the real application flow.

---

# 4. Technology Stack

## Frontend

* Next.js
* React
* JavaScript
* JSX
* Next.js App Router
* Tailwind CSS
* shadcn/ui
* Lucide React
* Framer Motion
* React Hook Form
* Zod
* TanStack Query
* Axios

Do not introduce TypeScript unless explicitly requested.

---

## Backend

* Node.js
* Express.js
* JavaScript
* REST API
* Axios on frontend communication layer
* Zod validation
* Helmet
* CORS
* express-rate-limit
* Pino logging

---

## Database

* MongoDB
* MongoDB Atlas
* Prisma

Do not use:

* Mongoose
* Sequelize
* TypeORM
* Raw SQL
* A second ORM

Prisma is the database access layer.

---

## Authentication

* JWT
* HTTP-only cookies
* Argon2id
* RBAC
* Secure cookie configuration
* Explicit CORS
* Rate limiting

---

## Storage

Cloudflare R2 is used for uploaded files.

Database stores file metadata.

Actual file content belongs in object storage.

---

## Testing

* Vitest
* Supertest
* Playwright

Use the appropriate testing layer for each requirement.

---

## Code Quality

* ESLint
* Prettier
* Husky
* lint-staged

---

## API Documentation

* OpenAPI
* Swagger

---

## Deployment

Frontend:

* Vercel

Backend:

* Railway

Database:

* MongoDB Atlas

Storage:

* Cloudflare R2

---

# 5. Architecture

The standard architecture is:

```text
Next.js
   ↓
TanStack Query
   ↓
Axios
   ↓
Express REST API
   ↓
Middleware
   ↓
Validation
   ↓
Controller
   ↓
Service
   ↓
Prisma
   ↓
MongoDB Atlas
```

File flow:

```text
Frontend
   ↓
Backend validation
   ↓
Cloudflare R2
   ↓
File metadata in MongoDB
```

---

# 6. Architectural Separation

Frontend is responsible for:

* Rendering
* User interaction
* Client-side validation
* UI state
* Query state
* Form state
* Presentation

Backend is responsible for:

* Authentication
* Authorization
* Business rules
* Points
* Progress
* Badges
* Competition rules
* Submission rules
* Data integrity
* Ownership
* Security
* Database writes

The frontend must never become the authoritative source for business-critical data.

---

# 7. Standard Feature Flow

Every feature must be traced through:

```text
UI
→ Page
→ Component
→ Hook
→ API client
→ REST endpoint
→ Middleware
→ Validator
→ Controller
→ Service
→ Prisma
→ MongoDB
→ Response
→ TanStack Query
→ UI update
```

Do not implement only the UI when the feature requires backend behavior.

---

# 8. Action Flow

For important actions:

```text
Button
→ Frontend handler
→ API request
→ Authentication
→ Authorization
→ Validation
→ Business logic
→ Database
→ Reward/progress update
→ Response
→ UI refresh/update
```

Examples:

* Complete session
* Submit assignment
* Submit project
* Register for competition
* Submit competition entry
* Award points
* Unlock badge

---

# 9. AI Coding Workflow

Every coding task follows:

## Step 1 — Understand

Understand:

* User request
* Existing architecture
* Existing feature
* Business rules
* Related documentation

Do not immediately modify files.

---

## Step 2 — Inspect

Inspect the existing implementation.

Check:

* Pages
* Components
* Hooks
* API clients
* Routes
* Controllers
* Services
* Validators
* Prisma schema
* Tests

Reuse existing architecture when appropriate.

---

## Step 3 — Plan

Before implementation, determine:

* Files to modify
* Files to create
* Data flow
* API changes
* Database changes
* Security implications
* Testing requirements
* UI/UX implications

---

## Step 4 — Implement

Implement the smallest complete solution.

Avoid unrelated refactoring unless required.

---

## Step 5 — Test

Run appropriate:

* Unit tests
* API tests
* Integration tests
* E2E tests
* Lint
* Build

---

## Step 6 — Verify

Verify:

* Happy path
* Error path
* Authorization
* Ownership
* Loading state
* Empty state
* Success state
* Mobile behavior
* Regression

---

## Step 7 — Report

Report:

* What changed
* Why
* Files changed
* Tests executed
* Results
* Remaining limitations

Never claim a test passed if it was not actually executed.

---

# 10. Bug/Error Workflow

When a coding error occurs, do not immediately jump to the fix.

First explain:

1. What the error means
2. Root cause
3. Why it happened
4. Where the problem exists
5. Possible solutions
6. Trade-offs of each solution
7. Recommended solution

Then:

8. Implement the solution
9. Run tests
10. Verify regression

Do not patch symptoms without understanding the underlying cause.

---

# 11. Repository Inspection

Before changing existing functionality:

Check:

```text
package.json
environment configuration
app structure
API layer
database schema
related components
related services
tests
```

Search for existing implementations before creating duplicates.

---

# 12. No Duplicate Architecture

Do not create multiple competing systems for the same purpose.

Examples:

Do not create:

```text
api.js
axiosClient.js
httpClient.js
request.js
```

when one centralized API layer is sufficient.

Do not create multiple authentication stores without a documented reason.

Do not create duplicate permission systems.

---

# 13. Frontend Architecture

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
└── styles/
```

Keep components focused.

---

# 14. Backend Architecture

Recommended structure:

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
│   └── app.js
│
├── prisma/
│   └── schema.prisma
│
├── tests/
└── server.js
```

---

# 15. Controller Rules

Controllers should remain thin.

Controllers should:

* Receive request
* Validate through middleware/schema
* Call service
* Return response

Business logic belongs primarily in services.

Avoid giant controllers.

---

# 16. Service Layer

Services contain business logic.

Examples:

```text
authService
roadmapService
sessionService
assignmentService
projectService
competitionService
badgeService
pointsService
notificationService
```

Services must enforce business rules independently of the frontend.

---

# 17. Validation

Use Zod for request validation.

Validate:

* Body
* Query parameters
* Route parameters
* Uploaded metadata where applicable

Never trust client input.

---

# 18. API Rules

API base:

```text
/api
```

Versioning may use:

```text
/api/v1
```

Use resource-oriented REST endpoints.

Examples:

```text
GET    /api/sessions
GET    /api/sessions/:id
POST   /api/sessions/:id/complete

GET    /api/assignments
POST   /api/assignments/:id/submissions

GET    /api/projects
POST   /api/projects/:id/submissions

GET    /api/competitions
POST   /api/competitions/:id/register
POST   /api/competitions/:id/submissions
```

---

# 19. HTTP Semantics

Use HTTP methods correctly:

```text
GET     read
POST    create/action
PATCH   partial update
PUT     full replacement when appropriate
DELETE  delete when permitted
```

Do not use POST for every operation without a reason.

---

# 20. API Responses

Use consistent responses.

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

Do not expose raw stack traces.

---

# 21. Authentication

Authentication uses:

```text
JWT
+
HTTP-only cookies
```

The browser should not receive authentication tokens through insecure client-accessible storage.

Do not store JWT authentication tokens in:

```text
localStorage
sessionStorage
```

unless explicitly required by a future architecture change.

---

# 22. Password Security

Passwords must be hashed using:

```text
Argon2id
```

Never store plaintext passwords.

Never log passwords.

Never return password hashes through API responses.

---

# 23. Authorization

Authentication answers:

> Who is the user?

Authorization answers:

> What is this user allowed to do?

Use RBAC and ownership checks.

Never rely only on frontend route hiding.

---

# 24. RBAC

Roles must be enforced on the backend.

Example conceptual roles:

```text
MEMBER
ADMIN
```

Additional roles may be introduced only when justified by product requirements.

---

# 25. Ownership / IDOR Prevention

Every resource containing user-owned data must verify ownership.

Example:

A member must not be able to access another member's private submission by changing:

```text
/submissions/:id
```

The backend must verify ownership.

---

# 26. Authentication State

Frontend must correctly handle:

```text
unknown
authenticated
unauthenticated
```

Do not assume authentication before `/auth/me` or equivalent state resolution.

---

# 27. Logout

Logout must:

1. Invalidate authentication state
2. Clear authentication cookie/session where applicable
3. Clear client auth state
4. Redirect to the intended public page
5. Prevent protected-route access
6. Re-check authentication after browser back navigation
7. Remain usable on mobile

Logout must be clearly different from:

```text
Back to Home
```

---

# 28. CORS

Use explicit allowed origins.

Do not use unrestricted production CORS:

```text
*
```

when credentials are required.

Authentication requests must support the configured credentials policy.

---

# 29. Security Headers

Use Helmet.

Protect against common browser security issues.

Do not expose unnecessary server information.

---

# 30. Rate Limiting

Rate limit sensitive endpoints, especially:

* Login
* Register
* Password reset
* Password-related operations
* Sensitive admin actions

Rate limits should be appropriate for the endpoint.

---

# 31. Environment Variables

Secrets must never be committed.

Use:

```text
.env
.env.example
```

Examples of secrets:

```text
DATABASE_URL
JWT_SECRET
R2 credentials
API secrets
```

`.env` must remain ignored by Git.

---

# 32. Database

OFFSCRIPT uses:

```text
MongoDB Atlas
+
Prisma
```

Do not use Mongoose.

Do not introduce another ORM.

---

# 33. Prisma

Prisma schema is:

```text
backend/prisma/schema.prisma
```

Prisma is the only database abstraction layer.

For MongoDB schema changes, use the Prisma-supported MongoDB workflow.

Do not use raw SQL.

---

# 34. Database IDs

MongoDB ObjectIds are used where appropriate.

Prisma model IDs should use the MongoDB ObjectId strategy.

Do not manually invent inconsistent ID formats across models.

---

# 35. Core Database Models

The system may include:

```text
User
Semester
Week
LearningSession
SessionProgress

Assignment
AssignmentSubmission

Project
ProjectProgress
ProjectSubmission

Competition
CompetitionRegistration
CompetitionSubmission

Badge
UserBadge

RewardRule
PointTransaction

FileAsset
Notification

ActivityEvent
AuditLog
```

Model names must remain semantically clear.

---

# 36. User Model

User stores profile and account information.

Typical data:

```text
id
email
username
passwordHash
fullName
avatar
bio
role
status
pointsBalance
createdAt
updatedAt
```

Profile should not be duplicated into an unnecessary separate collection.

---

# 37. User Identity

Normalize:

* Email
* Username

where required.

Email uniqueness must be enforced.

Username uniqueness must be enforced.

---

# 38. Learning Structure

Learning hierarchy:

```text
Semester
   ↓
Week
   ↓
LearningSession
```

Keep the hierarchy explicit.

---

# 39. Session Progress

Member progress must be stored or derived from authoritative completion data.

Do not hard-code progress percentages.

Example:

```text
SessionProgress
memberId
sessionId
status
completedAt
```

---

# 40. Session Completion

Completing a session must be idempotent.

Calling the completion endpoint twice must not award points twice.

Business logic must prevent duplicate rewards.

---

# 41. Assignments

Assignment lifecycle:

```text
NOT_STARTED
IN_PROGRESS
SUBMITTED
UNDER_REVIEW
APPROVED
REJECTED
LATE
```

The backend controls state transitions.

---

# 42. Assignment Submission

Submission must verify:

* Authentication
* Ownership
* Assignment availability
* Submission rules
* Deadline rules
* File rules where applicable

Do not trust the frontend status.

---

# 43. Projects

Project lifecycle:

```text
LOCKED
AVAILABLE
IN_PROGRESS
SUBMITTED
UNDER_REVIEW
APPROVED
REJECTED
COMPLETED
```

Backend owns project state.

---

# 44. Project Progress

Progress must be based on real project activity.

Do not use static values such as:

```text
progress: 75
```

unless that value is actually persisted and justified by the business model.

---

# 45. Competitions

Competition states:

```text
DRAFT
UPCOMING
REGISTRATION_OPEN
REGISTRATION_CLOSED
ACTIVE
SUBMISSION_CLOSED
UNDER_REVIEW
COMPLETED
CANCELLED
```

The backend determines whether registration/submission is currently allowed.

---

# 46. Competition Registration

Registration must verify:

* Authentication
* Eligibility
* Competition state
* Duplicate registration
* Registration deadline
* Any configured capacity/rules

Registration should be idempotent or safely reject duplicate registration.

---

# 47. Badges

Badges have:

```text
LOCKED
EARNED
```

Badge unlocking must be based on actual backend conditions.

Never mark badges earned only because the frontend displays them.

---

# 48. Points System

Points are a real business system.

Points may come from:

* Session completion
* Assignment completion
* Project completion
* Competition participation
* Competition result
* Contributions
* Badge bonuses
* Admin-configured activities

---

# 49. Point Source of Truth

The authoritative record is:

```text
PointTransaction
```

The system may also maintain:

```text
User.pointsBalance
```

as a cached balance.

The ledger remains the source of truth.

---

# 50. Point Idempotency

Every reward-triggering operation must prevent duplicate rewards.

Examples:

```text
session completion
assignment approval
project completion
competition registration reward
badge unlock
```

Use a stable idempotency/reference key where appropriate.

---

# 51. Point Configuration

Reward values must not be hard-coded throughout the frontend.

Admins should be able to configure applicable reward rules through the backend/admin system.

Frontend displays values returned by the API.

---

# 52. Transactions and Consistency

When one business action modifies multiple related records, use a transactional/consistency strategy supported by the database architecture.

Example:

```text
Complete Session
→ mark completion
→ create point transaction
→ update balance
→ unlock badge if applicable
```

These operations must not leave the system in an inconsistent state.

---

# 53. Concurrency

Consider race conditions for:

* Points
* Registration
* Submission
* Badge unlocking
* Completion
* Admin actions

Do not assume users only click once.

---

# 54. Database Constraints

Use unique constraints for important invariants.

Examples:

```text
User.email
User.username

SessionProgress(memberId, sessionId)

CompetitionRegistration(memberId, competitionId)

UserBadge(memberId, badgeId)

PointTransaction.idempotencyKey
```

---

# 55. Database Indexes

Create indexes based on real query patterns.

Common candidates:

```text
User.email
User.username
User.role

Session.semesterId
Session.weekId

SessionProgress.memberId
SessionProgress.sessionId

Assignment.status
Assignment.dueDate

Project.status

Competition.status
Competition.startDate
Competition.endDate

PointTransaction.userId
PointTransaction.createdAt

Notification.userId
Notification.readAt

AuditLog.actorId
AuditLog.createdAt
```

Do not create unnecessary indexes.

---

# 56. Dates

Store dates consistently in UTC.

Convert dates for display according to user/application requirements.

Do not mix arbitrary timezone assumptions.

---

# 57. Pagination

Large collections must be paginated.

Do not return thousands of records by default.

Use:

```text
page
limit
cursor
```

as appropriate.

---

# 58. Sorting

Sorting must be deterministic.

For example:

```text
createdAt DESC
id DESC
```

when necessary to guarantee stable ordering.

---

# 59. File Management

Actual files are stored in:

```text
Cloudflare R2
```

Database stores metadata such as:

```text
objectKey
bucket
originalName
mimeType
sizeBytes
checksum
ownerId
createdAt
```

Never store unnecessary binary content directly in normal database documents.

---

# 60. File Security

Validate:

* File size
* MIME type
* Extension
* Ownership
* Upload authorization

Do not trust the filename or client-provided MIME type alone.

---

# 61. Notifications

Notifications belong to users.

They should support states such as:

```text
read
unread
```

Notifications are not the same thing as audit logs.

---

# 62. Activity Events

Activity events represent product activity.

Examples:

```text
session completed
assignment submitted
project submitted
competition registered
badge earned
```

Activity events should not replace security audit logs.

---

# 63. Audit Logs

Audit logs record security/administrative actions.

Examples:

```text
role changed
user suspended
points manually awarded
competition modified
content deleted
```

Audit records should contain enough context to understand what happened.

---

# 64. Soft Delete / Archive

Do not destructively delete historical business data unless explicitly required.

Prefer:

```text
status
archivedAt
deletedAt
```

where appropriate.

Historical submissions, points, and audit records should remain traceable.

---

# 65. UI/UX Direction

OFFSCRIPT uses:

```text
Dark
Red
Technical
Premium
Competitive
Clean
```

The UI must feel like a serious developer platform.

---

# 66. Color System

Primary background:

```text
#080808
```

Secondary background:

```text
#0D0D0D
```

Surface:

```text
#121212
```

Card:

```text
#171717
```

Elevated:

```text
#1C1C1C
```

Border:

```text
#292929
```

Primary text:

```text
#F5F5F5
```

Secondary text:

```text
#A1A1A1
```

Muted text:

```text
#6B6B6B
```

Primary red:

```text
#E50914
```

Bright red:

```text
#FF1E2D
```

Dark red:

```text
#8B0000
```

---

# 67. UI Restrictions

Avoid:

* Excessive glassmorphism
* Neon overload
* Excessive gradients
* Giant rounded cards
* Childish gamification
* Excessive shadows
* Excessive animation
* Visual clutter

Red should be used strategically.

---

# 68. Typography

Typography must prioritize:

* Readability
* Hierarchy
* Technical character
* Consistency

Headings must be visually distinct from supporting text.

Do not use oversized typography merely for decoration.

---

# 69. Components

Reusable UI components should be created for repeated patterns.

Examples:

```text
Button
Input
Select
Modal
Card
Badge
Status
ProgressBar
PageHeader
EmptyState
LoadingState
ErrorState
```

Use shadcn/ui where appropriate.

---

# 70. Icons

Use Lucide React.

Icons must have a clear semantic purpose.

Do not use random emoji as primary UI icons.

---

# 71. Animation

Use Framer Motion selectively.

Animation should improve:

* Feedback
* Transitions
* Hierarchy
* Interaction clarity

Do not animate everything.

Avoid unnecessary loading animations.

---

# 72. Loading States

Every data-driven page should support loading.

Examples:

```text
Skeleton
Spinner
Disabled action
Loading button
```

Loading states must not cause layout instability.

---

# 73. Empty States

Empty states must explain:

* What is empty
* Why it may be empty
* What the user can do next

Avoid blank screens.

---

# 74. Error States

Errors must be:

* Understandable
* Actionable
* Safe

Do not expose:

```text
stack traces
database errors
internal implementation details
```

---

# 75. Success States

Successful actions must provide clear feedback.

Examples:

```text
Toast
Inline confirmation
Updated status
Updated progress
Updated points
```

Do not rely only on a silent state change.

---

# 76. Forms

Forms must include:

* Labels
* Correct input types
* Validation
* Error messages
* Loading state
* Disabled state
* Success feedback

Use:

```text
React Hook Form
+
Zod
```

where appropriate.

---

# 77. Dashboard

Dashboard must represent real member data.

Example structure:

```text
WELCOME BACK, JIHED

Keep building. Keep breaking.

1,240 OFFSCRIPT points

Semester 01
78%

Week 14
API Authentication Testing

Continue Learning
```

The values above are examples only.

Production values must come from the backend.

---

# 78. Roadmap

Roadmap states:

```text
COMPLETED
CURRENT
AVAILABLE
LOCKED
```

The UI must clearly communicate progression.

Do not allow the frontend to bypass backend eligibility rules.

---

# 79. Sessions

A session may display:

* Week
* Title
* Progress
* Objectives
* Materials
* Assignment
* Completion status
* Reward

Completion must use the backend completion flow.

---

# 80. Assignments UX

Assignment pages must display:

* Status
* Deadline
* Instructions
* Submission
* Reward
* Validation/errors
* Submission state

The UI must distinguish:

```text
NOT_STARTED
IN_PROGRESS
SUBMITTED
UNDER_REVIEW
APPROVED
REJECTED
LATE
```

---

# 81. Projects UX

Project pages should show:

* Difficulty
* Technologies
* Status
* Progress
* Reward
* Requirements
* Submission
* Evaluation status

---

# 82. Competitions UX

Competition pages should show:

* Competition title
* Description
* Dates
* Current state
* Eligibility
* Registration
* Rules
* Timeline
* Submission
* Evaluation
* Rewards

---

# 83. Badges UX

Badges should feel like premium technical collectibles.

Support:

```text
Earned
Locked
```

Do not make badges visually childish.

---

# 84. Points UX

Points page must provide:

* Current balance
* Point history
* Source
* Amount
* Date
* Relevant activity

Example:

```text
+50  Completed Week 14
+100 Project 2
+75 Competition
+25 Assignment
```

Examples are not production values.

---

# 85. Profile UX

Profile may include:

* Avatar
* Username
* Full name
* Email
* Bio
* Stats
* Progress
* Points
* Badges
* Projects
* Competitions

Profile editing must use real backend APIs.

---

# 86. Navigation

Guest navigation:

```text
Home
Roadmap
Competitions
Projects
Badges
Login
```

Optional:

```text
Join OFFSCRIPT
```

Authenticated navigation:

```text
Home
Roadmap
Competitions
Projects
Badges
Dashboard
Profile
```

---

# 87. Profile Menu

Authenticated profile menu may contain:

```text
My Dashboard
My Profile
My Badges
My Points
────────────
Logout
```

Logout must be a clearly destructive/authentication action.

---

# 88. Mobile Navigation

Mobile must remain usable.

Important actions must remain accessible.

Avoid:

* Horizontal overflow
* Desktop-only interactions
* Tiny touch targets
* Hidden critical actions

---

# 89. Responsive Design

Test at:

```text
Mobile
Tablet
Desktop
Large Desktop
```

No page should require horizontal scrolling for normal use.

---

# 90. Accessibility

Use:

* Semantic HTML
* Labels
* Keyboard navigation
* Visible focus states
* Accessible buttons
* Accessible dialogs
* Proper contrast
* ARIA only when necessary

Do not make an interaction mouse-only.

---

# 91. Data Fetching

Use TanStack Query for server state.

Avoid manually duplicating server state across unrelated React state variables.

Use query invalidation/refetching deliberately.

---

# 92. Axios

Use a centralized Axios client.

Centralize:

* Base URL
* Credentials
* Common headers
* Error handling
* Request configuration

Do not scatter API configuration throughout components.

---

# 93. Query Keys

Query keys must be stable and predictable.

Example:

```text
["dashboard"]
["roadmap"]
["session", sessionId]
["assignments"]
["assignment", assignmentId]
["projects"]
["project", projectId]
["competitions"]
["competition", competitionId]
["points"]
["profile"]
```

---

# 94. Optimistic Updates

Use optimistic UI only where rollback is safe.

Do not optimistically modify security-sensitive or financially/business-critical data without proper rollback and backend confirmation.

Backend remains authoritative.

---

# 95. Cache Invalidation

After important mutations, invalidate or update affected queries.

Examples:

```text
session completion
→ session
→ roadmap
→ dashboard
→ points
→ badges
```

Do not leave stale UI after successful mutations.

---

# 96. Backend Source of Truth

The backend owns:

```text
Authentication
Authorization
Roles
Ownership
Points
Progress
Badges
Competition state
Submission state
Eligibility
Reward rules
Database integrity
```

Frontend must not override these values.

---

# 97. Business State

Business state transitions must be explicit.

Do not allow arbitrary status changes from the client.

Example:

```text
SUBMITTED
```

must not be directly changed to:

```text
APPROVED
```

by a normal member request.

---

# 98. Idempotency

Critical operations must be safe against duplicate requests.

Examples:

```text
POST /sessions/:id/complete
POST /competitions/:id/register
POST /assignments/:id/submit
POST /projects/:id/submit
point awarding
badge unlocking
```

---

# 99. Authorization Matrix

Before implementing a protected feature, define:

```text
Who can read?
Who can create?
Who can update?
Who can delete?
Who owns the resource?
Who can approve?
Who can administer?
```

Do not assume role names are sufficient.

---

# 100. Admin

Admin capabilities may include:

* User management
* Content management
* Assignment management
* Project management
* Competition management
* Badge management
* Reward configuration
* Point awarding
* Audit review
* File management

Every admin action must be authorized on the backend.

---

# 101. Admin Points

Manual point awards must:

* Require authorization
* Create a point transaction
* Preserve reason/source
* Be auditable
* Avoid duplicate accidental awards

Never directly edit the balance without creating the authoritative ledger event.

---

# 102. Search

Search must be implemented server-side when datasets become large.

Do not download thousands of records to the browser just to filter them.

---

# 103. Filtering

Filters should be:

* Predictable
* Validated
* URL/query-state friendly where useful
* Efficient at database level

---

# 104. Performance

Avoid:

* N+1 queries
* Huge API payloads
* Unnecessary client-side computation
* Unbounded database queries
* Rendering massive lists without virtualization/pagination when necessary

---

# 105. Database Query Efficiency

Select only required fields where practical.

Use Prisma query capabilities rather than retrieving entire documents unnecessarily.

---

# 106. Logging

Use Pino for backend logging.

Logs must help diagnose:

* Requests
* Errors
* Important operations
* Security events

Do not log:

* Passwords
* JWT secrets
* Sensitive credentials
* Authentication tokens

---

# 107. Error Handling

Backend errors must be normalized.

Internal errors may be logged.

Users should receive safe messages.

Never expose implementation details such as:

```text
Prisma stack traces
MongoDB connection details
filesystem paths
environment variables
```

---

# 108. API Rate Limiting

Rate limits must be stricter for sensitive operations than normal read endpoints.

Examples:

```text
login
register
forgot password
reset password
admin mutations
```

---

# 109. CSRF

Because authentication uses cookies, CSRF protection must be considered for state-changing requests.

Use an appropriate same-site/cookie/CORS strategy and add explicit CSRF protection where required by the deployment/security model.

---

# 110. Password Reset

Password reset must:

* Use secure tokens
* Expire tokens
* Avoid exposing whether an account exists
* Never log reset secrets
* Invalidate tokens after use

---

# 111. Account Security

Account states should be enforced by the backend.

Potential states include:

```text
ACTIVE
SUSPENDED
DISABLED
```

A suspended/disabled account must not be able to bypass restrictions through frontend manipulation.

---

# 112. Data Integrity

Every business-critical write must verify:

```text
authentication
authorization
ownership
validation
state
relationships
constraints
```

---

# 113. Orphan Prevention

Do not create records referencing nonexistent business entities.

Examples:

* Submission without assignment
* Registration without competition
* Progress without session
* UserBadge without badge
* PointTransaction without valid user

---

# 114. Historical Data

Do not casually delete:

* Point transactions
* Submissions
* Audit logs
* Competition history
* Important activity

Historical records may be required for reporting and accountability.

---

# 115. Seed Data

Development seed data must be:

* Reproducible
* Clearly identifiable
* Safe
* Separate from production secrets

Never depend on manually created database records for application functionality.

---

# 116. Production Data

Never run destructive development seed logic against production.

Never reset production data casually.

---

# 117. Environment Separation

Maintain clear separation between:

```text
development
test
production
```

Each environment must have appropriate:

* Database
* Secrets
* API configuration
* CORS
* Cookies
* Logging
* Storage configuration

---

# 118. Testing Strategy

Use:

```text
Vitest
```

for unit/business logic.

Use:

```text
Supertest
```

for API integration.

Use:

```text
Playwright
```

for critical end-to-end flows.

---

# 119. Unit Tests

Test business logic such as:

* Point calculation
* Eligibility
* State transitions
* Progress calculation
* Badge rules
* Validation
* Idempotency

---

# 120. API Tests

Test:

* Authentication
* Authorization
* Validation
* CRUD
* Ownership
* Error responses
* State transitions
* Duplicate requests

---

# 121. E2E Tests

Critical flows include:

```text
Register
→ Login
→ Dashboard
→ Roadmap
→ Session
→ Complete session
→ Points update
→ Badge update
```

Also:

```text
Assignment submission
Project submission
Competition registration
Competition submission
Profile editing
Logout
Protected-route access after logout
Browser back after logout
```

---

# 122. Regression Testing

After modifying a shared component or service, verify affected functionality.

Do not test only the modified line.

---

# 123. Security Testing

Verify:

* Unauthorized access blocked
* Wrong role blocked
* Wrong owner blocked
* Invalid input rejected
* Rate limits work
* Authentication cookies configured correctly
* Sensitive data not exposed

---

# 124. Build Verification

Before declaring a feature complete:

```text
npm run lint
npm run test
npm run build
```

Use the actual scripts defined in `package.json`.

Do not invent script names.

---

# 125. Git Rules

Before committing:

```text
git status
git diff
tests
lint
build
secret check
```

Review changed files.

Do not commit:

```text
.env
credentials
tokens
node_modules
temporary files
debug dumps
```

---

# 126. Commit Quality

Commit messages should describe the actual change.

Examples:

```text
feat: add competition registration flow
fix: prevent duplicate session rewards
refactor: extract points service
test: add assignment submission coverage
```

---

# 127. Documentation Synchronization

When architecture changes, update the relevant documentation.

For example:

```text
database change
→ DATABASE.md
→ ARCHITECTURE.md if architecture changes
→ API.md if API changes
→ FEATURES.md if behavior changes
→ SKILLS.md if development rules change
```

Documentation must not describe an obsolete architecture.

---

# 128. Design-to-Code

When implementing from a design or Stitch specification:

Preserve:

* Layout hierarchy
* Typography hierarchy
* Color system
* Spacing
* Interaction states
* Responsive behavior

Do not blindly reproduce a visual mockup if it conflicts with application architecture or accessibility.

---

# 129. Stitch AI

Stitch-generated designs are visual references.

They do not define:

* Backend architecture
* Database schema
* Authentication
* Authorization
* Business rules

The implementation must adapt the visual design to the actual OFFSCRIPT architecture.

---

# 130. Production Readiness

A feature is not production-ready when the screen merely looks finished.

Production-ready means:

```text
UI
+
Responsive behavior
+
Validation
+
API
+
Authentication
+
Authorization
+
Business logic
+
Database
+
Error handling
+
Loading state
+
Empty state
+
Success state
+
Tests
+
Regression verification
```

---

# 131. Forbidden Shortcuts

Do not:

* Hard-code points
* Hard-code user progress
* Hard-code permissions
* Trust client role
* Trust client ownership
* Store passwords in plaintext
* Store auth JWTs in localStorage
* Use Mongoose
* Use raw SQL
* Duplicate API clients
* Duplicate auth systems
* Skip backend validation
* Skip tests for critical business logic
* Leave TODO placeholders for production features
* Fake API calls
* Hide broken functionality instead of fixing it

---

# 132. Feature Completion Checklist

Before considering a feature complete:

```text
[ ] Requirements understood
[ ] Existing code inspected
[ ] Architecture respected
[ ] UI implemented
[ ] Responsive behavior implemented
[ ] Form validation implemented
[ ] API implemented
[ ] Backend authorization implemented
[ ] Ownership verified
[ ] Business rules implemented
[ ] Database changes implemented
[ ] Loading state implemented
[ ] Empty state implemented
[ ] Error state implemented
[ ] Success feedback implemented
[ ] Idempotency considered
[ ] Tests added
[ ] Regression tested
[ ] Lint passed
[ ] Build passed
[ ] Documentation updated
```

---

# 133. Bug Completion Checklist

For every bug:

```text
[ ] Error meaning explained
[ ] Root cause identified
[ ] Problem location identified
[ ] Solutions compared
[ ] Trade-offs explained
[ ] Best solution selected
[ ] Fix implemented
[ ] Relevant tests executed
[ ] Regression checked
```

---

# 134. Code Quality Standard

Prefer:

```text
simple
explicit
maintainable
testable
secure
consistent
```

over:

```text
clever
over-engineered
duplicated
temporary
```

---

# 135. AI Agent Behavior

The AI agent must:

* Inspect before editing
* Reuse existing patterns
* Respect project architecture
* Explain important decisions
* Avoid unnecessary rewrites
* Test changes
* Report actual results
* Protect existing functionality
* Keep documentation synchronized

The AI agent must not blindly overwrite working code.

---

# 136. Final Quality Gate

Before declaring the project or feature complete, verify:

```text
Architecture
Database
API
Authentication
Authorization
Business Logic
UI/UX
Responsive Design
Security
Performance
Testing
Code Quality
Documentation
```

No major category should be ignored.

---

# 137. OFFSCRIPT Master Rule

The most important rule:

> Build OFFSCRIPT as a real production-oriented platform, not as a collection of visual pages.

Every implementation must preserve the relationship between:

```text
Design
+
Frontend
+
API
+
Authentication
+
Authorization
+
Business Logic
+
Database
+
Security
+
Testing
```

The backend is authoritative for business-critical state.

The database is authoritative for persisted data.

The API is the contract between frontend and backend.

The documentation is the architectural contract.

The UI is the user-facing representation of the real system.

When these layers disagree, investigate and correct the underlying inconsistency instead of hiding it.

---

# END OF SKILLS.md
