# OFFSCRIPT — TECH-STACK.md

> **Purpose:** This document defines the official technology stack, architecture decisions, development standards, and technical boundaries for the OFFSCRIPT platform.
>
> AI coding agents MUST read and follow this document before implementing or modifying project code.

---

# 1. PROJECT OVERVIEW

## Project

**OFFSCRIPT**

## Product Type

A technical learning and competitive development platform.

OFFSCRIPT combines:

* Structured learning roadmaps
* Learning sessions
* Assignments
* Real-world projects
* Competitions
* Member progress
* Gamification
* OFFSCRIPT Points
* Badges and achievements
* User profiles
* Admin-controlled rewards

---

# 2. CORE ARCHITECTURE

OFFSCRIPT uses a separated frontend/backend architecture.

```text
┌─────────────────────────────────────────────┐
│                  OFFSCRIPT                  │
├──────────────────────┬──────────────────────┤
│      FRONTEND        │       BACKEND        │
│                      │                      │
│      Next.js         │      Node.js         │
│      React           │      Express.js      │
│      JavaScript      │      JavaScript      │
│      Tailwind CSS    │      REST API        │
└──────────┬───────────┴──────────┬───────────┘
           │                      │
           │      REST API        │
           └──────────────────────┘
                                  │
                               Prisma
                                  │
                                  ↓
                            MongoDB Atlas
```

The frontend and backend MUST remain logically separated.

---

# 3. FRONTEND STACK

## Framework

**Next.js**

Use:

* Next.js App Router
* React Server Components where appropriate
* Client Components only when client-side interactivity/state is required

Do not introduce another frontend framework.

---

## Language

**JavaScript**

Use:

```text
.js
.jsx
```

Do NOT migrate the project to TypeScript unless the project owner explicitly requests it.

Do NOT create:

```text
.ts
.tsx
```

files.

---

## UI

**React**

Use reusable React components.

Prefer:

```text
Component
↓
Props
↓
Reusable behavior
```

Avoid unnecessarily large components.

---

# 4. STYLING

## Tailwind CSS

The official styling system is:

**Tailwind CSS**

Use Tailwind for:

* Layout
* Spacing
* Typography
* Colors
* Responsive design
* Borders
* Shadows
* States
* Component styling

Avoid introducing another styling framework.

Do not mix multiple styling systems without a clear architectural reason.

---

# 5. UI COMPONENT SYSTEM

## shadcn/ui

Use **shadcn/ui** when an accessible, reusable primitive is useful.

Examples:

* Dialog
* Dropdown Menu
* Select
* Tabs
* Tooltip
* Toast
* Form primitives

shadcn/ui does NOT define the OFFSCRIPT visual identity.

Tailwind customization must maintain the OFFSCRIPT design system.

---

# 6. ICONS

## Lucide React

Use:

**Lucide React**

for interface icons.

Avoid mixing multiple icon libraries unnecessarily.

Icons should be:

* Consistent
* Minimal
* Accessible
* Relevant to the action

---

# 7. ANIMATION

## Framer Motion

Use:

**Framer Motion**

only when animation improves UX.

Good use cases:

* Page transitions
* Modal transitions
* Progress feedback
* Badge unlock feedback
* Hover interactions
* Small success animations

Avoid:

* Excessive animations
* Constant motion
* Distracting backgrounds
* Heavy parallax
* Long loading animations

Performance and usability take priority over visual effects.

---

# 8. FORMS

## React Hook Form

Use:

**React Hook Form**

for complex forms.

Use it for:

* Registration
* Login
* Profile editing
* Assignment submissions
* Project submissions
* Competition forms
* Admin forms

Do not manually manage large forms with dozens of independent `useState` variables.

---

# 9. VALIDATION

## Zod

Use:

**Zod**

for schema validation.

Validation should exist on both sides:

```text
Frontend
    ↓
UX validation

Backend
    ↓
Security + data integrity validation
```

Frontend validation MUST NOT replace backend validation.

---

# 10. DATA FETCHING

## TanStack Query

Use:

**TanStack Query**

for server state.

Responsibilities:

* Fetching
* Caching
* Refetching
* Mutations
* Loading states
* Error states
* Cache invalidation

Example conceptual flow:

```text
React Component
       ↓
TanStack Query
       ↓
API Client
       ↓
Express REST API
```

---

# 11. STATE MANAGEMENT

Do NOT introduce Redux by default.

Use:

### Local UI State

React:

```javascript
useState
useReducer
```

for local state.

### Server State

TanStack Query.

### Shared UI State

React Context when genuinely necessary.

Do not introduce Zustand, Redux, MobX, or another global state library unless the project requirements justify it.

---

# 12. API CLIENT

## Axios

Use:

**Axios**

as the centralized HTTP client.

Create a reusable API client rather than creating ad-hoc requests throughout components.

Recommended structure:

```text
lib/
└── api/
    ├── client.js
    ├── auth.js
    ├── roadmap.js
    ├── sessions.js
    ├── assignments.js
    ├── projects.js
    ├── competitions.js
    ├── badges.js
    ├── points.js
    └── profile.js
```

The exact structure may evolve with the project.

---

# 13. BACKEND STACK

## Runtime

**Node.js**

---

## Framework

**Express.js**

Express is responsible for:

* REST API
* Routing
* Middleware
* Authentication
* Authorization
* Request validation
* Controllers

---

## Backend Language

**JavaScript**

Use:

```text
.js
```

Do NOT introduce TypeScript unless explicitly requested.

---

# 14. REST API

The backend exposes a REST API.

Example:

```text
/api/auth
/api/users
/api/roadmap
/api/sessions
/api/assignments
/api/projects
/api/competitions
/api/badges
/api/points
```

HTTP methods should follow normal REST conventions.

```text
GET
POST
PATCH
PUT
DELETE
```

Use the least destructive appropriate method.

---

# 15. BACKEND ARCHITECTURE

Use:

```text
Route
  ↓
Middleware
  ↓
Validator
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
MongoDB
```

## Routes

Routes define API endpoints.

They should remain thin.

---

## Controllers

Controllers should handle:

* Request extraction
* Calling services
* Response formatting
* HTTP status codes

Controllers should NOT contain large amounts of business logic.

---

## Services

Services contain business logic.

Examples:

```text
pointsService
progressService
badgeService
competitionService
roadmapService
assignmentService
projectService
```

---

# 16. DATABASE

## Database

**MongoDB**

---

## Hosting

**MongoDB Atlas**

MongoDB Atlas is the expected production database environment.

---

# 17. DATABASE ACCESS

## Prisma

Use:

**Prisma**

as the official database access layer.

Do NOT use Mongoose.

```text
Express
   ↓
Service
   ↓
Prisma Client
   ↓
MongoDB
```

Prisma should be the standard way application code communicates with MongoDB.

---

# 18. PRISMA RULES

Database access should NOT be scattered randomly throughout controllers.

Prefer:

```text
Controller
   ↓
Service
   ↓
Prisma
```

instead of:

```text
Controller
   ↓
Prisma
   ↓
Prisma
   ↓
Prisma
```

for complex business operations.

---

# 19. DATA MODEL

Expected core entities may include:

```text
User
Roadmap
Semester
Week
Session
Assignment
Project
Competition
Badge
PointTransaction
RewardRule
Progress
Submission
```

These are domain concepts, not necessarily a final Prisma schema.

Do not create models without a real requirement.

---

# 20. AUTHENTICATION

## Strategy

Use:

**JWT authentication with HTTP-only cookies.**

Do NOT store authentication tokens in `localStorage` unless explicitly required by a future architectural decision.

Preferred model:

```text
Login
  ↓
Express
  ↓
Validate credentials
  ↓
Generate JWT
  ↓
HTTP-only Cookie
  ↓
Authenticated requests
```

---

# 21. PASSWORD SECURITY

Use:

**Argon2id**

for password hashing.

Never store plaintext passwords.

Never log:

* Passwords
* Password hashes
* Authentication tokens
* Secrets

---

# 22. AUTHORIZATION

Use:

**RBAC — Role-Based Access Control**

Example roles:

```text
MEMBER
INSTRUCTOR
ADMIN
```

The exact role list must follow the actual product requirements.

Authorization MUST be enforced server-side.

Hiding a frontend button is NOT authorization.

---

# 23. SECURITY MIDDLEWARE

## Helmet

Use:

**Helmet**

for HTTP security headers.

---

## CORS

Use:

**cors**

with an explicit allowed-origin configuration.

Do NOT use unrestricted:

```text
*
```

for production authentication APIs.

---

## Rate Limiting

Use:

**express-rate-limit**

Apply rate limiting especially to:

```text
/login
/register
/forgot-password
/password-reset
```

and other abuse-sensitive endpoints.

---

# 24. LOGGING

## Pino

Use:

**Pino**

for structured backend logging.

Logs should help diagnose:

* API failures
* Authentication issues
* Database errors
* Unexpected application behavior

Never log:

```text
passwords
JWTs
cookies
API secrets
database credentials
private user data
```

---

# 25. ERROR HANDLING

Use centralized Express error handling.

Recommended flow:

```text
Route
 ↓
Controller
 ↓
Service
 ↓
Error
 ↓
Central Error Middleware
 ↓
Safe API Response
```

Do not expose raw internal stack traces to production users.

---

# 26. API ERROR FORMAT

Use a consistent error structure.

Conceptually:

```json
{
  "success": false,
  "message": "Unable to submit assignment.",
  "code": "ASSIGNMENT_SUBMISSION_FAILED"
}
```

Internal diagnostic information should remain server-side.

---

# 27. AUTHENTICATION FLOW

Recommended:

```text
Register
   ↓
Validate
   ↓
Hash password
   ↓
Create user
   ↓
Login
   ↓
JWT
   ↓
HTTP-only Cookie
```

Protected request:

```text
Request
 ↓
Auth Middleware
 ↓
Verify JWT
 ↓
Identify User
 ↓
Authorization
 ↓
Controller
```

---

# 28. LOGOUT

Logout must:

1. Invalidate/clear the authentication cookie.
2. Clear client authentication state.
3. Redirect appropriately.
4. Prevent access to protected routes.
5. Revalidate authentication after navigation.
6. Handle browser back navigation safely.

Logout is an authentication operation, not a simple navigation action.

---

# 29. FILE STORAGE

## Cloudflare R2

Use:

**Cloudflare R2**

for object/file storage where required.

Potential files:

```text
Profile avatars
Project submissions
Competition submissions
Certificates
Learning resources
```

Do NOT store large files directly inside MongoDB unless explicitly justified.

MongoDB should store file metadata/references where appropriate.

---

# 30. FILE UPLOAD SECURITY

Validate:

```text
File size
File type
File extension
Authentication
Authorization
Upload destination
```

Never trust client-provided file metadata blindly.

---

# 31. POINT SYSTEM

OFFSCRIPT Points are business data.

Points MUST NOT be controlled directly by frontend code.

Bad:

```javascript
user.points += 50;
```

Good:

```text
User Action
   ↓
Backend Validation
   ↓
Reward Rule
   ↓
Point Transaction
   ↓
Updated Balance
```

---

# 32. POINT TRANSACTIONS

Use transaction records for point changes.

Conceptually:

```text
PointTransaction

id
userId
activityType
amount
description
createdAt
metadata
```

The actual Prisma schema should follow the final domain requirements.

---

# 33. REWARD RULES

Reward values should be configurable.

Conceptually:

```text
RewardRule

activityType
points
enabled
description
```

Examples:

```text
SESSION_COMPLETION
ASSIGNMENT_COMPLETION
PROJECT_COMPLETION
COMPETITION_PARTICIPATION
BADGE_BONUS
CONTRIBUTION
```

These activity types are examples and may be extended.

---

# 34. POINT INTEGRITY

Never trust:

```text
points
userId
activityType
reward
```

provided directly by the frontend.

The backend determines whether a reward is valid.

Prevent:

* Duplicate rewards
* Unauthorized point manipulation
* Negative manipulation
* Repeated completion exploits

where applicable.

---

# 35. PROGRESS SYSTEM

Progress should be based on actual completion data.

Do NOT hard-code dashboard values.

Bad:

```javascript
const progress = 78;
```

Good:

```text
Completed activities
        ↓
Progress calculation
        ↓
Backend
        ↓
Frontend
```

---

# 36. BADGE SYSTEM

Badges should be unlocked through verified conditions.

Example:

```text
Completed 10 sessions
       ↓
Backend verifies condition
       ↓
Badge unlocked
       ↓
Member receives achievement
```

Do not allow arbitrary client-side badge unlocking.

---

# 37. COMPETITIONS

Competition actions must be server validated.

Validate:

```text
Eligibility
Registration
Deadline
Submission status
Participant identity
Competition state
Result authority
```

Do not rely only on frontend timers.

---

# 38. ASSIGNMENTS

Assignment workflows should support appropriate states.

Example:

```text
NOT_STARTED
IN_PROGRESS
SUBMITTED
COMPLETED
OVERDUE
```

The exact status model should follow the actual product specification.

---

# 39. PROJECTS

Project workflows should support:

```text
Available
In Progress
Submitted
Completed
Archived
```

Actual states depend on product requirements.

---

# 40. ROADMAP

The roadmap represents structured learning progression.

Conceptual hierarchy:

```text
Roadmap
   ↓
Semester
   ↓
Week
   ↓
Session
   ↓
Assignment
```

Current progression should be calculated from real member activity.

---

# 41. API DOCUMENTATION

Use:

**OpenAPI / Swagger**

to document the REST API.

Document:

* Endpoint
* HTTP method
* Authentication
* Request body
* Query parameters
* Response
* Error responses

API documentation should remain synchronized with actual API behavior.

---

# 42. TESTING

Use three primary testing layers.

## Unit Tests

**Vitest**

Use for:

* Business logic
* Utility functions
* Point calculations
* Progress calculations
* Reward rules
* Validation logic

---

## API Integration Tests

**Supertest**

Use for:

* Authentication
* API endpoints
* Authorization
* Request validation
* Database-facing flows where appropriate

---

## End-to-End Tests

**Playwright**

Use for critical user journeys.

Examples:

```text
Register
Login
Logout
Open Dashboard
Continue Session
Complete Assignment
Submit Project
Join Competition
Earn Points
Unlock Badge
```

---

# 43. TESTING PRINCIPLE

A critical feature should be tested across the full path when practical:

```text
UI
 ↓
API
 ↓
Business Logic
 ↓
Database
```

Do not test only whether a button renders.

---

# 44. CODE QUALITY

## ESLint

Use:

**ESLint**

for JavaScript/React code quality.

---

## Prettier

Use:

**Prettier**

for consistent formatting.

---

## Husky

Use:

**Husky**

for Git hooks.

---

## lint-staged

Use:

**lint-staged**

to run checks against staged files.

---

# 45. GIT

Use Git and GitHub for version control.

Before committing:

```text
Review git diff
Run tests
Run lint
Check build
Check secrets
Check generated files
```

Do not commit:

```text
.env
secrets
tokens
credentials
node_modules
build artifacts
```

unless explicitly required.

---

# 46. ENVIRONMENT VARIABLES

Secrets MUST be stored in environment variables.

Examples:

```text
DATABASE_URL
JWT_SECRET
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
API_URL
```

Never hard-code production secrets.

Provide:

```text
.env.example
```

with placeholder values where appropriate.

---

# 47. FRONTEND ENVIRONMENT VARIABLES

Only expose variables that are explicitly safe for the browser.

Never expose:

```text
JWT_SECRET
DATABASE credentials
R2 secret keys
private API secrets
```

through public frontend environment variables.

---

# 48. DEPLOYMENT

Recommended production architecture:

```text
┌────────────────────┐
│      Vercel        │
│      Next.js       │
└─────────┬──────────┘
          │
          │ HTTPS REST API
          ↓
┌────────────────────┐
│      Railway       │
│   Node + Express   │
└─────────┬──────────┘
          │
          ↓
┌────────────────────┐
│   MongoDB Atlas    │
└────────────────────┘

          +
          
┌────────────────────┐
│   Cloudflare R2    │
│    File Storage    │
└────────────────────┘
```

The exact hosting provider may change later without changing the application architecture.

---

# 49. HTTPS

Production traffic must use HTTPS.

Authentication cookies should use secure cookie configuration in production.

Recommended cookie properties include:

```text
HttpOnly
Secure
SameSite
```

with values determined by the deployment architecture.

---

# 50. CORS ARCHITECTURE

Frontend and backend origins should be explicitly configured.

Example conceptual configuration:

```text
Frontend:
https://offscript.example

Backend:
https://api.offscript.example
```

Do not allow arbitrary origins in production.

---

# 51. RESPONSIVE UI

The frontend must support:

```text
Desktop
Laptop
Tablet
Mobile
```

Use Tailwind responsive utilities.

Avoid fixed desktop-only layouts.

---

# 52. DESIGN SYSTEM

OFFSCRIPT visual identity:

```text
DARK
RED
TECHNICAL
PREMIUM
COMPETITIVE
CLEAN
```

Primary colors:

```text
#080808
#0D0D0D
#121212
#171717
#292929

#F5F5F5
#A1A1A1
#6B6B6B

#E50914
#FF1E2D
#8B0000
```

---

# 53. DESIGN RESTRICTIONS

Avoid:

* Excessive glassmorphism
* Excessive neon
* Excessive gradients
* Excessive rounded cards
* Childish gamification
* Over-animation
* Visual clutter
* Random color systems
* Unnecessary decorative elements

Red is the main brand accent.

---

# 54. ACCESSIBILITY

UI must support:

* Keyboard navigation
* Focus states
* Semantic HTML
* Accessible labels
* Sufficient contrast
* Screen-reader-friendly controls
* Proper form labels
* Accessible modals
* Accessible dropdowns

Never create icon-only actions without an accessible label.

---

# 55. PERFORMANCE

Avoid:

* Unnecessary dependencies
* Duplicate API requests
* Unnecessary client components
* Large unoptimized images
* Excessive JavaScript
* Excessive animations

Prefer server rendering where appropriate.

Use client components only when necessary.

---

# 56. NEXT.JS SERVER VS CLIENT COMPONENTS

Default:

**Server Component**

Use Client Components only when the component requires:

```text
useState
useEffect
browser APIs
event-driven client interaction
client-side libraries
```

Do not add:

```text
"use client"
```

to every component automatically.

---

# 57. FOLDER STRUCTURE

Recommended frontend:

```text
frontend/
│
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
├── lib/
│   ├── api/
│   ├── auth/
│   └── utils/
│
├── hooks/
│
├── public/
│
└── styles/
```

Adapt this structure to the actual Next.js project.

---

# 58. BACKEND FOLDER STRUCTURE

Recommended:

```text
backend/
│
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
│
└── server.js
```

---

# 59. NAMING CONVENTIONS

Use clear names.

Components:

```text
PascalCase
```

Example:

```text
DashboardCard.jsx
ProfileDropdown.jsx
CompetitionCard.jsx
```

Functions/variables:

```text
camelCase
```

Example:

```text
getUserProgress
awardPoints
competitionStatus
```

Constants:

```text
UPPER_SNAKE_CASE
```

where appropriate.

---

# 60. BUSINESS LOGIC LOCATION

Business logic belongs primarily in backend services.

Examples:

```text
calculateProgress()
awardPoints()
unlockBadge()
validateCompetitionSubmission()
completeSession()
```

Do not duplicate business logic in:

* React components
* API route handlers
* Multiple controllers

---

# 61. SOURCE OF TRUTH

The backend is the source of truth for:

```text
Authentication
Authorization
Points
Progress
Badges
Competition state
Assignment state
Project state
User permissions
```

The frontend displays and interacts with this data.

It must not independently override it.

---

# 62. IDEMPOTENCY

Important actions should consider duplicate requests.

Especially:

```text
Session completion
Assignment submission
Competition registration
Point awarding
Badge unlocking
```

If a user double-clicks a button or the request is retried, the system should not accidentally duplicate rewards or records.

---

# 63. TRANSACTIONAL BUSINESS OPERATIONS

Where multiple related records must change together, use appropriate transactional or consistency mechanisms supported by the chosen MongoDB/Prisma architecture.

Example:

```text
Complete Session
   ↓
Update Progress
   ↓
Award Points
   ↓
Check Badge
```

Avoid partial state where possible.

---

# 64. UI DATA STATES

Every data-driven page must support:

```text
Loading
Success
Empty
Error
```

Interactive components should also support:

```text
Default
Hover
Active
Focus
Disabled
Loading
Success
Error
```

---

# 65. EMPTY STATES

Empty states should explain:

```text
What happened?
Why is the list empty?
What can the user do next?
```

Example:

```text
No projects yet.

Start your first project from the roadmap.

[ Explore Roadmap ]
```

---

# 66. ERROR STATES

Errors should be actionable.

Example:

```text
We couldn't load your roadmap.

[ Try Again ]
```

Avoid exposing internal technical errors.

---

# 67. LOADING STATES

Prefer skeleton loading for content-heavy pages.

Avoid blank screens.

Avoid unnecessary full-screen spinners.

---

# 68. API RESPONSE CONSISTENCY

Use consistent response structures.

Conceptually:

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
  "message": "Request failed.",
  "code": "REQUEST_FAILED"
}
```

Adapt to the actual API architecture if an established format already exists.

Do not break existing API contracts unnecessarily.

---

# 69. DOCUMENTATION FILES

The project should maintain:

```text
README.md
TECH-STACK.md
SKILLS.md
.env.example
```

Additional documentation may be created when architectural complexity requires it.

---

# 70. AI AGENT RULES

AI coding agents MUST:

1. Read `TECH-STACK.md`.
2. Read `SKILLS.md`.
3. Inspect existing implementation.
4. Reuse existing architecture.
5. Avoid unnecessary dependencies.
6. Avoid changing technologies without explicit approval.
7. Run relevant tests.
8. Report changed files.
9. Report test results.
10. Clearly identify unresolved issues.

---

# 71. TECHNOLOGY RESTRICTIONS

Without explicit approval, do NOT replace:

```text
Next.js
React
JavaScript
Tailwind CSS
Node.js
Express.js
MongoDB
Prisma
```

Do NOT introduce:

```text
TypeScript
Mongoose
Redux
another backend framework
another database
another frontend framework
```

merely because they are preferred by the AI agent.

---

# 72. DEPENDENCY RULE

Before adding a dependency:

Ask:

```text
Does the project already solve this?

Is this dependency necessary?

Does it duplicate existing functionality?

Is the maintenance cost justified?

Does it significantly increase bundle/server complexity?
```

Prefer existing dependencies.

---

# 73. FEATURE IMPLEMENTATION FLOW

Every significant feature should follow:

```text
Requirement
    ↓
Inspect
    ↓
Architecture Plan
    ↓
Database/API
    ↓
Business Logic
    ↓
Frontend
    ↓
Validation
    ↓
Testing
    ↓
UX Review
    ↓
Final Verification
```

Do not build only the UI and declare the feature complete.

---

# 74. BUG FIX FLOW

For every bug:

```text
1. Understand the error
2. Identify the root cause
3. Locate the affected code
4. Identify possible solutions
5. Compare trade-offs
6. Select the appropriate solution
7. Implement
8. Test
9. Verify regression
```

Never blindly patch symptoms.

---

# 75. SECURITY-FIRST RULE

When functionality conflicts with security:

Security takes priority.

Examples:

```text
Client convenience
        ↓
Server validation

UI restriction
        ↓
Server authorization

Frontend points
        ↓
Backend reward system
```

---

# 76. DATA INTEGRITY

Never allow the frontend to directly determine trusted business values.

Especially:

```text
userId
role
points
badge
progress
competition result
completion status
```

These values must be verified server-side.

---

# 77. FINAL QUALITY CHECK

Before a feature is considered complete:

```text
[ ] Architecture respected
[ ] Correct technology stack used
[ ] No unnecessary dependency
[ ] Frontend implemented
[ ] Backend implemented where required
[ ] Database implemented where required
[ ] Validation implemented
[ ] Authorization implemented
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] Success feedback
[ ] Responsive design
[ ] Accessibility checked
[ ] Security checked
[ ] Unit tests
[ ] API tests
[ ] E2E tests where appropriate
[ ] Build passes
[ ] No console errors
[ ] No secrets
[ ] Git diff reviewed
```

---

# 78. OFFSCRIPT TECHNICAL PRINCIPLE

The project should remain:

```text
Simple enough to maintain
+
Structured enough to scale
+
Secure enough for real users
+
Flexible enough for future features
```

Avoid both extremes:

```text
Under-engineering
```

and:

```text
Unnecessary over-engineering
```

---

# 79. OFFICIAL STACK SUMMARY

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             OFFSCRIPT
          TECHNOLOGY STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FRONTEND
Next.js
React
JavaScript / JSX
Tailwind CSS
shadcn/ui
Lucide React
Framer Motion
React Hook Form
Zod
TanStack Query
Axios

BACKEND
Node.js
Express.js
JavaScript
REST API
Zod
Helmet
CORS
express-rate-limit
Pino

DATABASE
MongoDB
MongoDB Atlas
Prisma

AUTHENTICATION
JWT
HTTP-only Cookies
Argon2id
RBAC

STORAGE
Cloudflare R2

TESTING
Vitest
Supertest
Playwright

CODE QUALITY
ESLint
Prettier
Husky
lint-staged

API DOCUMENTATION
OpenAPI / Swagger

DEPLOYMENT
Vercel
Railway
MongoDB Atlas
Cloudflare R2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

# 80. FINAL RULE

**Do not change the OFFSCRIPT technology stack without explicit project-owner approval.**

When a technical problem appears, first try to solve it within the existing stack.

Only propose replacing a technology when there is a concrete technical reason, and clearly explain:

```text
Current technology
Problem
Alternative
Advantages
Trade-offs
Migration impact
Recommendation
```

The default decision is:

**Keep the existing OFFSCRIPT stack.**

# END OF TECH-STACK.md
