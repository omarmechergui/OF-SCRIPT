# OFFSCRIPT — REST API Contract

## 1. Purpose

This document defines the REST API contract for OFFSCRIPT.

It specifies:

* API structure
* Base URL
* HTTP methods
* Authentication requirements
* Authorization
* Request validation
* Response format
* Error format
* Pagination
* Filtering
* Sorting
* Resource conventions
* Status codes
* Security requirements
* API versioning
* Frontend integration rules

The backend API is the contract between the Next.js frontend and the Express backend.

Any API change must consider both consumers and existing functionality.

---

# 2. API Architecture

OFFSCRIPT uses a REST API.

```text
Next.js
   ↓
Axios
   ↓
HTTPS
   ↓
Express.js
   ↓
Routes
   ↓
Middleware
   ↓
Controllers
   ↓
Services
   ↓
Prisma
   ↓
MongoDB Atlas
```

The frontend MUST NOT access the database directly.

---

# 3. Base URL

Development:

```text id="3t8p7n"
http://localhost:5000/api
```

Production:

```text id="9qk3lm"
https://<production-api-domain>/api
```

The production URL must be configured through environment variables.

Do not hard-code production URLs inside frontend components.

---

# 4. API Versioning

The API should be structured so versioning can be introduced safely.

Recommended structure:

```text id="h3kzq4"
/api/v1/...
```

If the initial implementation uses:

```text id="v7r8ad"
/api/...
```

do not introduce versioning halfway through development without an explicit decision.

The selected convention must remain consistent.

---

# 5. Resource Naming

Use plural resource names.

Examples:

```text id="j1q8ps"
/users
/sessions
/assignments
/projects
/competitions
/badges
/points
```

Use nouns rather than frontend-oriented action names.

Preferred:

```text id="5xq4m8"
POST /sessions/:id/complete
```

rather than:

```text id="2g8s0r"
POST /completeSession
```

Action endpoints are acceptable when the operation represents a real business command.

---

# 6. HTTP Methods

Use HTTP methods according to operation semantics.

```text id="q9c3w1"
GET     Read
POST    Create / Execute command
PUT     Full replacement when appropriate
PATCH   Partial update
DELETE  Delete / deactivate when appropriate
```

Examples:

```text id="z5k2ae"
GET    /users/me
PATCH  /users/me
GET    /sessions/:id
POST   /sessions/:id/complete
POST   /assignments/:id/submissions
POST   /competitions/:id/register
```

---

# 7. Authentication

Authentication uses JWT-based sessions delivered through HTTP-only cookies.

Protected requests are authenticated by the backend.

Frontend code should not manually attach authentication tokens to every request.

The browser sends the authentication cookie automatically when configured correctly.

Axios should use credentials:

```javascript id="j2p7qa"
withCredentials: true
```

---

# 8. Authentication Endpoints

Core authentication endpoints:

```text id="0w6v5s"
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
POST /auth/forgot-password
POST /auth/reset-password
```

Additional verification endpoints may be added if email verification is implemented.

---

# 9. Register

```text id="6u0k8d"
POST /auth/register
```

Purpose:

Create a new OFFSCRIPT account.

Request example:

```json id="5r4zpj"
{
  "username": "omar",
  "email": "omar@example.com",
  "password": "strong-password",
  "firstName": "Omar",
  "lastName": "Mechergui"
}
```

The backend must:

1. Validate the request
2. Normalize appropriate fields
3. Check uniqueness
4. Hash the password with Argon2id
5. Create the user
6. Establish authentication if the product flow requires it
7. Return safe user information

Never return `passwordHash`.

---

# 10. Login

```text id="b8r4n2"
POST /auth/login
```

Request:

```json id="2m8q4f"
{
  "email": "omar@example.com",
  "password": "strong-password"
}
```

Backend responsibilities:

* Validate input
* Locate account
* Verify password
* Check account status
* Create JWT
* Set secure HTTP-only cookie
* Return safe user information

The JWT must not be returned for frontend storage unless the authentication architecture is explicitly changed.

---

# 11. Current User

```text id="g4r2x7"
GET /auth/me
```

Returns the currently authenticated user.

Example:

```json id="1r3m8v"
{
  "success": true,
  "data": {
    "id": "user-id",
    "username": "omar",
    "firstName": "Omar",
    "lastName": "Mechergui",
    "role": "MEMBER"
  }
}
```

Sensitive fields must not be returned.

---

# 12. Logout

```text id="x7v1q9"
POST /auth/logout
```

The backend must invalidate/clear the authentication cookie.

Frontend responsibilities:

* Clear cached authenticated-user state
* Redirect to a public page
* Prevent protected UI from remaining accessible
* Revalidate authentication on protected navigation

Logout must work on desktop and mobile.

---

# 13. User API

Conceptual endpoints:

```text id="v2s5p0"
GET   /users/me
PATCH /users/me
GET   /users/:id
```

Administrative user management may use separate endpoints.

Example:

```text id="0m8y3d"
GET   /admin/users
PATCH /admin/users/:id
PATCH /admin/users/:id/role
PATCH /admin/users/:id/status
```

Admin routes MUST require appropriate authorization.

---

# 14. Dashboard API

```text id="x3m8q1"
GET /dashboard
```

Purpose:

Return the authenticated member's dashboard data.

Possible response data:

```text id="v4n6k8"
user
points
progress
currentSemester
currentWeek
currentSession
recentActivity
badges
upcomingAssignments
upcomingCompetitions
```

Dashboard aggregation belongs to the backend.

The frontend should not reconstruct the complete dashboard from multiple unrelated requests unless there is a specific reason.

---

# 15. Roadmap API

```text id="r6k2m9"
GET /roadmap
GET /roadmap/progress
GET /semesters
GET /semesters/:id
GET /weeks/:id
```

The backend determines:

* Completed weeks
* Current week
* Available weeks
* Locked weeks
* User progress

The frontend only renders the result.

---

# 16. Sessions API

Core endpoints:

```text id="n7w3q2"
GET  /sessions
GET  /sessions/:id
GET  /weeks/:id/sessions
POST /sessions/:id/start
POST /sessions/:id/complete
```

Depending on the final product rules, some actions may be merged or removed.

---

# 17. Session Completion

```text id="p4m8x0"
POST /sessions/:id/complete
```

Backend must:

1. Authenticate user
2. Authorize operation
3. Validate session
4. Verify completion eligibility
5. Prevent duplicate completion
6. Persist completion
7. Process progress
8. Process points
9. Check badge conditions
10. Return updated state

Conceptual response:

```json id="s9q2d4"
{
  "success": true,
  "data": {
    "session": {},
    "progress": {},
    "points": {},
    "badges": []
  }
}
```

The operation must be idempotent or safely handle repeated requests.

---

# 18. Assignments API

Core endpoints:

```text id="k7d2p5"
GET  /assignments
GET  /assignments/:id
POST /assignments/:id/submissions
GET  /assignments/:id/submissions
```

Member-specific endpoints may include:

```text id="q5w8m1"
GET /me/assignments
GET /me/assignments/:id
```

Avoid unnecessary endpoint duplication.

Choose one consistent resource convention.

---

# 19. Assignment Submission

```text id="f3r7m2"
POST /assignments/:id/submissions
```

Backend validates:

* Authentication
* Assignment existence
* User eligibility
* Deadline
* Submission content
* File references
* Submission limits
* Current assignment state

The backend determines whether the submission earns points.

The client cannot provide authoritative reward values.

---

# 20. Projects API

Core endpoints:

```text id="w8q3n5"
GET  /projects
GET  /projects/:id
POST /projects/:id/start
PATCH /projects/:id/progress
POST /projects/:id/submissions
GET  /projects/:id/submissions
```

Project progress must be validated server-side.

Example:

```text id="s6k1p4"
0 ≤ progress ≤ 100
```

---

# 21. Project Submission

```text id="e2m7q8"
POST /projects/:id/submissions
```

The backend validates:

* User eligibility
* Project state
* Submission deadline
* Required fields
* Repository URL
* Demo URL
* Attached files
* Submission limits

The backend determines completion and rewards according to business rules.

---

# 22. Competitions API

Core endpoints:

```text id="a8v4r2"
GET  /competitions
GET  /competitions/:id
POST /competitions/:id/register
DELETE /competitions/:id/register
POST /competitions/:id/submissions
GET  /competitions/:id/submissions
```

Additional administrative endpoints:

```text id="n1k6z7"
POST  /admin/competitions
PATCH /admin/competitions/:id
DELETE /admin/competitions/:id
```

Admin endpoints require authorization.

---

# 23. Competition Registration

```text id="d7x2p1"
POST /competitions/:id/register
```

Backend verifies:

* User authentication
* Competition existence
* Competition registration state
* Registration dates
* User eligibility
* Duplicate registration

The database should prevent duplicate registrations.

---

# 24. Competition Submission

```text id="q9m3w6"
POST /competitions/:id/submissions
```

Backend verifies:

```text id="r8k1c3"
User is registered
+
Competition allows submissions
+
Deadline has not passed
+
Submission data is valid
```

The frontend cannot override any of these rules.

---

# 25. Badges API

Core endpoints:

```text id="m4q8x2"
GET /badges
GET /badges/:id
GET /users/me/badges
```

The backend determines:

* Earned badges
* Locked badges
* Criteria
* Earned date
* Bonus points

Badge unlocking must be backend-controlled.

---

# 26. Points API

Core endpoints:

```text id="p8r2m5"
GET /points
GET /points/balance
GET /points/history
```

Potential admin endpoints:

```text id="v6n1q4"
GET  /admin/points/rules
POST /admin/points/award
PATCH /admin/points/rules/:id
```

Exact administrative capabilities depend on the final admin feature definition.

---

# 27. Point History

```text id="w2m7k9"
GET /points/history
```

Recommended query parameters:

```text id="k4r8x1"
?page=1
&limit=20
&type=EARNED
&source=SESSION_COMPLETION
```

Backend must validate and cap pagination values.

---

# 28. Profile API

```text id="z3q7m8"
GET   /profile
PATCH /profile
```

Potential fields:

```text id="f8n2c5"
avatar
firstName
lastName
bio
```

Email and username changes should have additional security rules if supported.

---

# 29. File API

If file uploads are required:

```text id="m5x8q2"
POST   /files
GET    /files/:id
DELETE /files/:id
```

The backend controls:

* File size
* MIME type
* Extension
* Ownership
* Upload authorization
* Storage key
* Access permissions

Files are stored in Cloudflare R2.

MongoDB stores file metadata.

---

# 30. Notifications API

If notifications are enabled:

```text id="q7m2w4"
GET   /notifications
PATCH /notifications/:id/read
PATCH /notifications/read-all
```

The backend determines notification ownership.

A user must never be able to modify another user's notifications.

---

# 31. Admin API

Administrative routes should be separated logically.

Example:

```text id="n8q4p1"
/admin/users
/admin/assignments
/admin/projects
/admin/competitions
/admin/badges
/admin/points
/admin/rewards
/admin/audit-logs
```

Every admin endpoint requires:

```text id="x4m7r9"
Authentication
+
Authorization
+
Validation
```

---

# 32. Authorization

Every protected endpoint must define its authorization requirement.

Example table:

| Resource       |               Member |      Admin |
| -------------- | -------------------: | ---------: |
| Own profile    |           Read/Write | Read/Write |
| Own points     |                 Read |       Read |
| Own badges     |                 Read |       Read |
| Sessions       |        Read/Complete |     Manage |
| Assignments    |          Read/Submit |     Manage |
| Projects       |          Read/Submit |     Manage |
| Competitions   | Read/Register/Submit |     Manage |
| Users          |             Own data |     Manage |
| Reward rules   |                   No |     Manage |
| Point awarding |                   No |     Manage |

This table is conceptual and must match the final RBAC implementation.

---

# 33. Request Validation

All external input must be validated.

Validate:

```text id="g4p9m1"
Body
Params
Query
Headers where applicable
```

Zod is used for request validation.

Frontend validation improves user experience but does not replace backend validation.

---

# 34. ID Validation

Resource identifiers must be validated before database operations.

Invalid IDs should return a controlled API error.

Do not allow malformed IDs to produce raw database errors to users.

---

# 35. Query Parameters

List endpoints may support:

```text id="v1q8m4"
page
limit
search
sort
order
status
type
```

Only approved parameters are accepted.

The backend should:

* Validate parameter types
* Apply safe defaults
* Apply maximum limits
* Restrict sortable fields
* Normalize filters

---

# 36. Pagination Contract

Recommended response:

```json id="p4w7n2"
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

Default page size:

```text id="z8m2q6"
20
```

Maximum page size:

```text id="r5x1n9"
100
```

These values may be changed according to actual requirements.

Never allow unlimited client-controlled result sizes.

---

# 37. Standard Success Response

Use a consistent structure:

```json id="j6k3q9"
{
  "success": true,
  "data": {}
}
```

For lists:

```json id="t8m1v5"
{
  "success": true,
  "data": [],
  "meta": {}
}
```

---

# 38. Standard Error Response

Use:

```json id="c7p2x4"
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {}
  }
}
```

The `details` field should contain safe, useful validation information.

Never expose:

* Stack traces
* Database connection information
* Secrets
* Password hashes
* Internal infrastructure details

---

# 39. Error Codes

Use stable machine-readable error codes.

Examples:

```text id="n4r8q2"
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
RATE_LIMITED
INVALID_CREDENTIALS
ACCOUNT_DISABLED
DEADLINE_PASSED
ALREADY_COMPLETED
ALREADY_REGISTERED
SUBMISSION_NOT_ALLOWED
INTERNAL_ERROR
```

The exact list can evolve.

Frontend code should use `error.code` rather than parsing human-readable messages whenever possible.

---

# 40. HTTP Status Codes

Recommended mapping:

| Status | Meaning                                     |
| -----: | ------------------------------------------- |
|    200 | Successful request                          |
|    201 | Resource created                            |
|    204 | Successful request without response body    |
|    400 | Invalid request                             |
|    401 | Not authenticated                           |
|    403 | Authenticated but not authorized            |
|    404 | Resource not found                          |
|    409 | Conflict                                    |
|    422 | Semantically invalid input when appropriate |
|    429 | Rate limit exceeded                         |
|    500 | Unexpected server error                     |

The implementation should use the most semantically appropriate status code consistently.

---

# 41. Authentication Errors

Unauthenticated requests should return:

```json id="e7m3q1"
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

Do not reveal whether sensitive account information exists when doing so would create an account-enumeration risk.

---

# 42. Authorization Errors

If the user is authenticated but lacks permission:

```json id="q2w8n5"
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action"
  }
}
```

Do not rely on frontend button visibility as authorization.

---

# 43. Conflict Errors

Use `409 Conflict` when an operation conflicts with current state.

Examples:

```text id="y5m2r7"
Duplicate registration
Duplicate badge
Duplicate session completion
Username already exists
Email already exists
```

---

# 44. Rate Limiting

Sensitive endpoints should be rate limited.

Especially:

```text id="k7x1p4"
POST /auth/login
POST /auth/register
POST /auth/forgot-password
POST /auth/reset-password
```

Additional rate limits may apply to:

* File uploads
* Submissions
* Administrative operations

Use `express-rate-limit`.

---

# 45. CORS

CORS must explicitly allow the OFFSCRIPT frontend origin.

Do not use unrestricted:

```text id="a4n8q2"
*
```

for credentialed authentication requests.

Production configuration must explicitly define allowed origins.

---

# 46. Cookies

Authentication cookies should use secure settings.

Production should use:

```text id="r6m1w8"
HttpOnly
Secure
SameSite
```

according to the deployment topology.

Cookie configuration must be compatible with the frontend/backend domains.

---

# 47. CSRF Considerations

Because authentication uses cookies, CSRF protection must be considered.

The selected strategy may include:

* SameSite cookie policy
* CSRF token protection where required
* Origin validation
* Strict CORS

The final implementation must evaluate the actual deployment topology.

---

# 48. File Upload Security

File endpoints must validate:

```text id="p9x3m7"
Size
MIME type
Extension
Ownership
Authorization
Filename
Storage key
```

Do not trust the client-provided MIME type alone.

Avoid executable or dangerous uploads unless explicitly required.

---

# 49. API Idempotency

Business operations that can be repeated should be idempotent where practical.

Critical operations include:

```text id="m2q8v5"
Session completion
Assignment submission
Project submission
Competition registration
Point awarding
Badge unlocking
```

The API and database design must prevent duplicate rewards.

---

# 50. Backend Source of Truth

The API response must reflect backend state.

The client must not decide:

```text id="c5r7n1"
How many points were earned
Whether a badge is unlocked
Whether a competition is open
Whether a session is completed
Whether a user is authorized
```

These decisions belong to the backend.

---

# 51. Caching

TanStack Query handles frontend server-state caching.

The backend may introduce HTTP caching later where appropriate.

Do not cache sensitive personalized data incorrectly.

Authenticated responses must be reviewed carefully before adding public caching.

---

# 52. API Security Headers

Express should use Helmet.

Security-related headers should be configured according to production requirements.

Do not expose unnecessary server information.

---

# 53. API Logging

API requests should be logged appropriately using Pino.

Logs should include useful operational information such as:

```text id="k3w8m1"
HTTP method
Route
Status
Duration
Request ID where applicable
User ID where appropriate
```

Never log:

```text id="v7p2q4"
Passwords
JWT secrets
Authentication tokens
Private credentials
Sensitive personal information unnecessarily
```

---

# 54. API Documentation

The API should be documented using:

```text id="x8m4q2"
OpenAPI / Swagger
```

Documentation should describe:

* Endpoints
* Authentication
* Request schemas
* Response schemas
* Errors
* Parameters
* Authorization requirements

`API.md` defines the high-level contract.

OpenAPI should become the machine-readable API contract when implemented.

---

# 55. Frontend API Layer

Frontend API modules should be organized by domain.

Recommended:

```text id="q5m9r1"
frontend/lib/api/
├── client.js
├── auth.js
├── dashboard.js
├── roadmap.js
├── sessions.js
├── assignments.js
├── projects.js
├── competitions.js
├── badges.js
├── points.js
├── profile.js
└── notifications.js
```

Components should call these modules instead of constructing URLs manually.

---

# 56. API Hooks

TanStack Query hooks should wrap API calls.

Example:

```text id="n2v7k4"
useDashboard()
useRoadmap()
useSession()
useAssignments()
useProjects()
useCompetitions()
useBadges()
usePoints()
useProfile()
```

Mutations:

```text id="p8m3x1"
useCompleteSession()
useSubmitAssignment()
useSubmitProject()
useRegisterCompetition()
useSubmitCompetition()
useUpdateProfile()
useLogout()
```

Names should reflect actual business actions.

---

# 57. Query Invalidation

After mutations, invalidate or update relevant queries.

Example:

```text id="w4q9m2"
Complete Session
      ↓
Invalidate:
  session
  roadmap
  dashboard
  points
  badges
```

The exact invalidation strategy depends on the mutation.

Avoid unnecessary global cache invalidation.

---

# 58. Optimistic Updates

Optimistic updates may be used only for operations where temporary client assumptions are safe.

Avoid optimistic updates for:

* Point balances
* Badge unlocking
* Authorization
* Competition state
* Critical submissions

For these operations, wait for backend confirmation.

---

# 59. API Consistency

Similar resources should follow similar patterns.

For example:

```text id="j8m2q5"
GET collection
GET resource
POST action
PATCH resource
DELETE resource
```

Avoid introducing inconsistent conventions between modules without a clear reason.

---

# 60. API Evolution

When changing an endpoint:

1. Identify frontend consumers
2. Identify backend consumers
3. Update validation
4. Update response contract
5. Update tests
6. Update API documentation
7. Verify existing flows

Do not silently change response structures.

---

# 61. Breaking Changes

Breaking changes include:

* Removing fields
* Renaming fields
* Changing field types
* Changing authentication behavior
* Changing status values
* Changing required request fields
* Changing response structure

Breaking changes require explicit consideration and regression testing.

---

# 62. API Testing

Every important endpoint should have automated tests.

Test:

```text id="r7m3x8"
Success
Validation failure
Unauthorized access
Forbidden access
Not found
Conflict
Rate limiting where applicable
Business-rule violations
Duplicate requests
```

Critical flows should also be tested with Playwright.

---

# 63. Critical API Flows

At minimum:

```text id="f2q8m4"
Register
   ↓
Login
   ↓
Get Current User
   ↓
Access Dashboard
   ↓
Complete Session
   ↓
Receive Points
   ↓
Unlock Badge
   ↓
Submit Assignment
   ↓
Register Competition
   ↓
Submit Competition
   ↓
Logout
```

Each flow must preserve backend data integrity.

---

# 64. API Anti-Patterns

Do NOT:

* Put business logic inside route definitions
* Trust frontend authorization
* Trust frontend point values
* Trust frontend progress values
* Return raw database errors
* Return passwords or password hashes
* Store JWTs in localStorage
* Use unrestricted CORS
* Create undocumented endpoints
* Allow unlimited queries
* Accept arbitrary sort fields
* Allow arbitrary status transitions
* Duplicate reward logic across frontend components

---

# 65. Definition of Done for an Endpoint

An endpoint is considered complete when applicable:

```text id="k9r2x7"
Route
HTTP method
Authentication
Authorization
Validation
Controller
Service
Database operation
Success response
Error response
Security handling
Tests
Documentation
Frontend integration
```

Not every endpoint requires every item, but protected business operations must implement the appropriate controls.

---

# 66. API Implementation Flow

Before implementing an endpoint:

```text id="q8m4v2"
1. Define business requirement
2. Define resource/action
3. Define request schema
4. Define response schema
5. Define authentication
6. Define authorization
7. Define service logic
8. Define database interaction
9. Define error cases
10. Implement
11. Test
12. Document
```

---

# 67. Final API Architecture

```text id="m3x7q9"
                    Browser
                       │
                       ▼
                  Next.js App
                       │
                    Axios
                       │
                     HTTPS
                       │
                       ▼
                Express REST API
                       │
              ┌────────┴────────┐
              │                 │
      Authentication       Authorization
              │                 │
              └────────┬────────┘
                       │
                   Validation
                       │
                   Controller
                       │
                    Service
                       │
                    Prisma
                       │
                       ▼
                 MongoDB Atlas
```

---

# 68. Final Rule

The API is a strict contract.

Frontend code must consume the API.

Backend code must enforce the business rules.

Database operations must remain behind the backend.

Every important state-changing operation must be authenticated, authorized, validated, persisted, tested, and reflected back to the frontend consistently.
