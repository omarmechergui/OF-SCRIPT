# OFFSCRIPT — Authentication & Authorization

## 1. Purpose

This document defines the authentication and authorization architecture for OFFSCRIPT.

It is the source of truth for:

* Registration
* Login
* Logout
* JWT sessions
* HTTP-only cookies
* Password hashing
* Role-based access control
* Protected routes
* Permission checks
* Session validation
* Authentication errors
* Account security
* Password recovery
* Frontend authentication state

Any authentication or authorization implementation MUST follow this document.

---

# 2. Authentication Stack

OFFSCRIPT uses:

```text id="q7m3v8"
JWT
HTTP-only cookies
Argon2id
Express middleware
RBAC
Zod validation
Helmet
CORS
Rate limiting
```

Authentication is handled by the Express backend.

The frontend does not directly manage JWT secrets.

---

# 3. Authentication Architecture

```text id="m4x8p2"
Browser
   │
   │ Login credentials
   ▼
Next.js
   │
   │ POST /api/auth/login
   ▼
Express API
   │
   ├── Validate input
   ├── Find user
   ├── Verify password
   ├── Check account status
   ├── Generate JWT
   │
   ▼
HTTP-only Cookie
   │
   ▼
Browser
```

For subsequent requests:

```text id="j8q2n5"
Browser
   │
   │ Cookie
   ▼
Express
   │
   ▼
JWT Verification
   │
   ▼
Authenticated User
   │
   ▼
Authorization
   │
   ▼
Controller / Service
```

---

# 4. Authentication Principle

The backend is the final authority on authentication.

The frontend may maintain a local representation of authentication state for UI purposes, but this state is not trusted by the backend.

Never trust:

```text id="v6m1q4"
localStorage
sessionStorage
React state
cookies created by frontend JavaScript
URL parameters
client-provided user IDs
```

as proof of identity.

---

# 5. JWT Strategy

JWT is used as the authentication session token.

The JWT should contain only the minimum claims required.

Possible claims:

```text id="x2r7m9"
sub
role
iat
exp
```

Do not place sensitive personal data inside the JWT.

Do not place:

```text id="n4q8k2"
password
passwordHash
private profile data
secrets
large application state
```

inside the token.

---

# 6. JWT Secret

The JWT secret MUST come from an environment variable.

Example:

```text id="w8m3p5"
JWT_SECRET
```

Never hard-code:

```javascript id="r4q7n1"
const JWT_SECRET = "my-secret";
```

Never commit production secrets to Git.

---

# 7. JWT Expiration

JWTs must have an explicit expiration.

Example environment variable:

```text id="m2x8q4"
JWT_EXPIRES_IN
```

The exact duration should be selected according to the final security/product requirements.

Avoid indefinite JWT sessions.

---

# 8. Authentication Cookie

The JWT is stored in an HTTP-only cookie.

Recommended production attributes:

```text id="p7n4v2"
HttpOnly
Secure
SameSite
Path=/
```

Example conceptual cookie:

```text id="q8m1x5"
offscript_auth=<JWT>
```

The actual cookie name should be defined once and reused consistently.

---

# 9. Why HTTP-only Cookies

HTTP-only cookies prevent normal client-side JavaScript from reading the authentication token.

This reduces exposure to token theft through client-side scripts.

The browser sends the cookie automatically to the appropriate backend origin according to cookie rules.

---

# 10. Secure Cookie Rules

Production cookies MUST use:

```text id="r3m8q1"
Secure=true
```

Development may require different settings when running over local HTTP.

Cookie behavior must be environment-aware.

Do not weaken production cookie security to make development convenient.

---

# 11. SameSite Policy

The selected `SameSite` value must match the actual deployment architecture.

Possible values:

```text id="n6x2p8"
Strict
Lax
None
```

If `SameSite=None` is required, `Secure` is also required by modern browsers.

Do not blindly use `SameSite=None`.

---

# 12. CORS

Because authentication uses cookies, CORS must be explicit.

Never use unrestricted:

```text id="0m7q3x"
Access-Control-Allow-Origin: *
```

with credentialed requests.

The backend should explicitly allow the configured frontend origin.

Example environment variable:

```text id="j5v8r2"
FRONTEND_URL
```

---

# 13. Axios Credentials

Frontend API requests must send credentials.

The centralized Axios client should use:

```javascript id="c8m2q7"
withCredentials: true
```

Do not configure authentication independently in every component.

---

# 14. Password Hashing

Passwords must be hashed using:

```text id="x4q9m1"
Argon2id
```

Never store plaintext passwords.

Never use:

```text id="p2v7k5"
password === database.password
```

Passwords must be verified using the password hashing library.

---

# 15. Password Storage

Database:

```text id="m8r3x6"
passwordHash
```

Allowed:

```text
Argon2id hash
```

Forbidden:

```text
Plain password
Reversible encryption
Base64 encoded password
MD5
SHA-1
```

---

# 16. Registration Flow

```text id="w4q8n2"
Register Page
    ↓
React Hook Form
    ↓
Zod client validation
    ↓
POST /auth/register
    ↓
Backend Zod validation
    ↓
Normalize email / username
    ↓
Check uniqueness
    ↓
Hash password with Argon2id
    ↓
Create user
    ↓
Create authenticated session if configured
    ↓
Set HTTP-only cookie
    ↓
Return safe user data
```

The backend must never trust the frontend validation result.

---

# 17. Login Flow

```text id="z7m2q5"
Login Page
    ↓
POST /auth/login
    ↓
Validate request
    ↓
Find account
    ↓
Verify Argon2id password
    ↓
Check account status
    ↓
Generate JWT
    ↓
Set HTTP-only cookie
    ↓
Return safe user data
```

---

# 18. Invalid Credentials

For invalid login credentials, return a controlled error.

Example:

```json id="q5r8m1"
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

Avoid unnecessarily revealing whether:

```text id="m4x7p2"
email exists
account exists
password was incorrect
```

This reduces account enumeration.

---

# 19. Login Rate Limiting

Login must be rate limited.

Protection should consider:

```text id="n8q3v6"
IP
Account identifier
Request frequency
```

Use:

```text id="p7m2x4"
express-rate-limit
```

Do not rely only on frontend cooldown timers.

---

# 20. Registration Rate Limiting

Registration should also be rate limited.

This reduces:

* Automated account creation
* Abuse
* Resource exhaustion
* Spam

---

# 21. Forgot Password

Endpoint:

```text id="x3q8m5"
POST /auth/forgot-password
```

Expected flow:

```text id="v4n7r2"
User enters email
      ↓
Backend accepts request
      ↓
Generate secure reset token
      ↓
Store secure representation / expiration
      ↓
Send reset email
```

The response should not reveal whether the email belongs to an account.

Example:

```text id="q8m2x5"
"If the account exists, a password reset email has been sent."
```

---

# 22. Password Reset

Endpoint:

```text id="r5m1q7"
POST /auth/reset-password
```

The reset token must:

* Be cryptographically secure
* Have short expiration
* Be single-use
* Be invalidated after successful reset

The new password must be hashed using Argon2id.

---

# 23. Password Reset Security

Do not store raw password-reset tokens in plaintext when avoidable.

Prefer storing a secure hash of the token.

Conceptual:

```text id="w7q3m8"
Raw reset token
      ↓
Hash
      ↓
Database
```

The token should be compared securely when resetting the password.

---

# 24. Logout Flow

Endpoint:

```text id="m2x8q4"
POST /auth/logout
```

Flow:

```text id="p6r1n9"
User clicks Logout
      ↓
Frontend sends logout request
      ↓
Backend clears authentication cookie
      ↓
Frontend clears authenticated-user cache
      ↓
Redirect to public page
```

The logout operation must be safe to call more than once.

---

# 25. Logout Cookie Clearing

The backend must clear the cookie using compatible attributes.

The cookie being cleared must match the relevant:

```text id="k4m8q2"
name
path
domain
```

configuration where applicable.

A logout implementation that only deletes frontend state is incomplete.

---

# 26. Protected Routes

Protected pages include member-only areas such as:

```text id="v8q2m4"
/dashboard
/sessions
/assignments
/projects
/competitions
/points
/profile
```

The exact route list belongs to the final route structure.

---

# 27. Protected API Endpoints

Backend endpoints that expose private user data or perform user actions must require authentication.

Example:

```text id="r3m7x1"
GET /dashboard
POST /sessions/:id/complete
POST /assignments/:id/submissions
POST /competitions/:id/register
GET /points
PATCH /profile
```

---

# 28. Authentication Middleware

Recommended middleware:

```text id="q7n2m5"
authenticate
```

Responsibilities:

1. Read authentication cookie
2. Check token existence
3. Verify JWT signature
4. Verify expiration
5. Extract user identity
6. Attach authenticated user information to request
7. Reject invalid authentication

Example conceptual request state:

```javascript id="m4x8q2"
req.user = {
  id,
  role
};
```

---

# 29. Authentication Middleware Rule

Do not query the database unnecessarily on every request if the JWT contains sufficient identity information.

However, database lookup may be required when:

* Account status must be checked live
* Role changes must take effect immediately
* User was disabled
* Sensitive operation requires fresh authorization data

The final strategy should balance security and performance.

---

# 30. Authorization

Authentication answers:

```text id="n7q3m1"
"Who are you?"
```

Authorization answers:

```text id="x2m8r5"
"What are you allowed to do?"
```

These are separate concerns.

---

# 31. RBAC

OFFSCRIPT uses Role-Based Access Control.

Conceptually:

```text id="p5v9q2"
User
  ↓
Role
  ↓
Permissions
  ↓
Resource / Action
```

Example:

```text id="m8q3x7"
MEMBER
  ├── Read sessions
  ├── Complete sessions
  ├── Submit assignments
  ├── Submit projects
  ├── Register competitions
  └── Manage own profile

ADMIN
  └── Administrative capabilities
```

Exact permissions must match the final product requirements.

---

# 32. Authorization Middleware

Recommended:

```text id="q4m7x2"
requireRole(...)
```

or a permission-oriented middleware when the application grows.

Example conceptual usage:

```javascript id="w8n2r5"
router.post(
  "/admin/points/award",
  authenticate,
  requireRole("ADMIN"),
  validate(schema),
  controller.awardPoints
);
```

---

# 33. Frontend Authorization

The frontend may hide or disable controls based on role.

Example:

```text id="m3q8v1"
ADMIN
→ Show Admin Panel

MEMBER
→ Hide Admin Panel
```

However:

```text id="x7r2n5"
Hidden UI ≠ Security
```

The backend must enforce the permission.

---

# 34. User Ownership

Users may generally access only their own private resources.

Example:

```text id="n4m8q2"
GET /users/me/points
```

A user must not be able to modify another user's points by changing an ID.

Bad:

```text id="r5x1m7"
PATCH /users/:id/points
```

without authorization checks.

---

# 35. IDOR Prevention

Every resource access must verify ownership or permission.

Example:

```text id="q8m3v6"
User A
 ↓
GET /assignments/submissions/submission-of-user-B
```

The backend must reject the request unless User A has legitimate permission to access that submission.

Never rely on hidden IDs.

---

# 36. Admin Security

Administrative operations are high-risk.

Examples:

```text id="m7q2x4"
Change user role
Disable account
Award points
Change reward rules
Create competition
Change competition state
Manage badges
View audit logs
```

These operations require:

```text id="r3n8p1"
Authentication
+
Admin authorization
+
Input validation
+
Audit logging where appropriate
```

---

# 37. Point Award Authorization

Users must never be able to award themselves arbitrary points.

Forbidden request pattern:

```json id="x5m8q2"
{
  "points": 100000
}
```

where the backend blindly trusts the value.

The backend determines the allowed amount.

Administrative manual awards must be explicitly authorized and auditable.

---

# 38. Badge Authorization

Users must not be able to directly unlock arbitrary badges.

Forbidden:

```text id="n7r2m4"
POST /badges/unlock
```

with a client-selected badge ID unless the endpoint is strictly controlled.

Badges should be unlocked by backend business rules or authorized administrative actions.

---

# 39. Session Completion Authorization

A user can complete only sessions they are legitimately allowed to access.

The backend should verify:

```text id="q4m8x1"
Authenticated user
+
Session exists
+
Session is available
+
User is eligible
+
Completion has not already been processed
```

---

# 40. Competition Authorization

Registration and submission must verify:

```text id="m2r7x5"
Authenticated user
+
Competition exists
+
Competition state
+
Registration period
+
User eligibility
```

Submission additionally verifies:

```text id="x8q3n1"
User registration
+
Submission period
+
Submission limits
```

---

# 41. Assignment Authorization

Assignment submission must verify:

```text id="p6m2q8"
Authenticated user
+
Assignment exists
+
Assignment is available
+
Deadline
+
Submission rules
```

---

# 42. Project Authorization

Project operations must verify:

```text id="r4x7m1"
Authenticated user
+
Project exists
+
User eligibility
+
Project state
+
Submission deadline
```

---

# 43. Authentication State on Frontend

The frontend should obtain authentication state from the backend.

Recommended:

```text id="m8q2v5"
GET /auth/me
```

This endpoint can be used to establish the current authenticated user.

TanStack Query can cache the result.

---

# 44. Auth Query

Recommended conceptual hook:

```text id="q3m7x1"
useCurrentUser()
```

It should represent server state rather than a manually maintained fake authentication object.

---

# 45. Protected Page Behavior

When a protected page loads:

```text id="x5r8n2"
Page
 ↓
Check authenticated user
 ↓
Authenticated?
 ├── Yes → Render
 └── No  → Redirect to Login
```

The backend remains the ultimate authority.

---

# 46. Browser Back Button

After logout:

```text id="m7q2x4"
Logout
 ↓
Public page
 ↓
Browser Back
 ↓
Protected page request
 ↓
Authentication check
 ↓
Access denied / redirect
```

Previously displayed sensitive data should not become authoritative simply because it remains in browser history/cache.

---

# 47. Auth Cache Clearing

On logout, clear or invalidate authentication-dependent client state.

Potentially affected queries:

```text id="p4m8x7"
currentUser
dashboard
points
badges
profile
roadmap
notifications
```

Avoid leaking one user's cached data into another authenticated session.

---

# 48. Login After Logout

The application must correctly support:

```text id="q8m3r1"
User A
 ↓
Logout
 ↓
User B Login
 ↓
User B sees only User B data
```

Cached personalized queries must be invalidated or scoped correctly.

---

# 49. Account Status

Users may have an account state such as:

```text id="m5x7q2"
ACTIVE
DISABLED
```

A disabled account must not be allowed to authenticate or perform protected operations according to the final policy.

Account status should be enforced by the backend.

---

# 50. Email Verification

If email verification is implemented, account verification should be backend-controlled.

Potential flow:

```text id="r8q2m5"
Register
 ↓
Create unverified account
 ↓
Send verification email
 ↓
User verifies
 ↓
Account becomes verified
```

Do not mark accounts verified based solely on frontend actions.

---

# 51. Session Revocation

JWTs are stateless by design.

If the application requires immediate session revocation, an additional mechanism may be needed.

Possible approaches include:

```text id="x3m8q1"
Token version
Session record
Revocation list
Short-lived access token + refresh token
```

Do not introduce a complex session system unless the product's security requirements justify it.

The initial implementation should remain simple while preserving the ability to evolve.

---

# 52. Refresh Tokens

A refresh-token architecture is optional.

Do not introduce refresh tokens automatically.

If session duration requirements make them necessary, define:

```text id="q7m2v4"
Access token
Refresh token
Rotation
Revocation
Storage
Expiration
Reuse detection
```

before implementation.

---

# 53. Password Change

If implemented:

```text id="n4x8m2"
PATCH /auth/password
```

The backend should require:

* Authentication
* Current password
* Valid new password
* Argon2id hashing

After a password change, session invalidation policy should be explicitly defined.

---

# 54. Password Requirements

Password requirements should balance usability and security.

Backend validation should define:

```text id="m7q3r1"
Minimum length
Maximum length
Accepted characters
Common-password handling if required
```

Avoid arbitrary complexity rules that do not provide meaningful security.

Never rely only on frontend password validation.

---

# 55. Sensitive Operations

Additional verification may be required for sensitive actions.

Examples:

```text id="x2m8q5"
Change password
Change email
Change role
Award points
Administrative changes
```

The final implementation should define whether re-authentication or additional verification is required.

---

# 56. Authentication Errors

Use stable error codes.

Examples:

```text id="q5r7m2"
UNAUTHORIZED
INVALID_CREDENTIALS
ACCOUNT_DISABLED
TOKEN_EXPIRED
INVALID_TOKEN
FORBIDDEN
```

Do not expose internal authentication implementation details.

---

# 57. Security Headers

Use Helmet in Express.

Security headers should be configured for the production environment.

Do not expose unnecessary server metadata.

---

# 58. CSRF Protection

Cookie-based authentication requires CSRF considerations.

The final implementation should use an appropriate combination of:

```text id="m8q2x4"
SameSite cookies
Explicit CORS
Origin validation
CSRF tokens when required
```

Do not assume CORS alone is a complete CSRF defense.

---

# 59. Authentication Logging

Security-relevant events may be logged.

Examples:

```text id="r3m7q8"
Successful login
Failed login
Logout
Password reset request
Password reset completion
Account disable
Role change
```

Logs must not contain:

```text id="x7m2q5"
Passwords
JWT values
Reset tokens
Secrets
```

---

# 60. Audit Logging

Administrative authentication-related actions should be auditable.

Example:

```text id="q8n4m1"
Admin changes User role
       ↓
AuditLog
       ↓
actorId
action
target user
timestamp
metadata
```

Do not store secrets in audit records.

---

# 61. Environment Variables

Authentication configuration belongs in `.env`.

Example:

```text id="m5q8r2"
JWT_SECRET=
JWT_EXPIRES_IN=
FRONTEND_URL=
COOKIE_NAME=
```

If password-reset email is implemented, email service configuration also belongs in environment variables.

Never commit actual values.

---

# 62. Development vs Production

Development may use:

```text id="x4m7q1"
localhost
HTTP
Secure=false
```

Production should use:

```text id="q8r2m5"
HTTPS
Secure=true
Explicit CORS
Production secrets
Production cookie policy
```

Do not copy development security settings directly into production.

---

# 63. Authentication Testing

At minimum test:

### Registration

```text id="m7x2q4"
Valid registration
Duplicate email
Duplicate username
Invalid input
Weak password
Rate limiting
```

### Login

```text id="r5q8n1"
Valid credentials
Invalid credentials
Disabled account
Malformed input
Rate limiting
Cookie creation
```

### Logout

```text id="x3m7q2"
Valid logout
Repeated logout
Cookie clearing
Protected route after logout
Browser back behavior
```

---

# 64. Authorization Testing

Test:

```text id="q8m2r5"
Member accessing member resource
Member accessing admin resource
Admin accessing admin resource
User accessing another user's resource
Unauthenticated request
Expired JWT
Invalid JWT
Disabled account
```

---

# 65. Security Testing

Test for:

```text id="m4x7q1"
IDOR
Privilege escalation
Mass assignment
JWT manipulation
Cookie misconfiguration
CORS misconfiguration
Rate-limit bypass
Input validation bypass
Unauthorized point awarding
Unauthorized badge unlocking
```

---

# 66. Authentication Anti-Patterns

Never:

```text id="r8m2q4"
Store JWT in localStorage
Store plaintext passwords
Hard-code JWT secret
Trust frontend role
Trust frontend user ID
Allow unrestricted CORS
Return password hashes
Allow client-controlled points
Allow client-controlled badge unlocking
Skip backend authorization
Use frontend-only route protection
Log authentication tokens
```

---

# 67. Authentication Flow Summary

```text id="x7m3q8"
REGISTER
   ↓
Validate
   ↓
Hash password
   ↓
Create User
   ↓
Authenticate if configured
   ↓
HTTP-only Cookie


LOGIN
   ↓
Validate
   ↓
Verify password
   ↓
Check account
   ↓
JWT
   ↓
HTTP-only Cookie


PROTECTED REQUEST
   ↓
Cookie
   ↓
JWT Verification
   ↓
Authentication
   ↓
Authorization
   ↓
Validation
   ↓
Service
   ↓
Response


LOGOUT
   ↓
Clear Cookie
   ↓
Clear Client Auth State
   ↓
Redirect
   ↓
Protected Access Rejected
```

---

# 68. Definition of Done

Authentication is complete only when applicable:

```text id="m2q8r5"
Registration
Login
Logout
HTTP-only cookies
Argon2id
JWT verification
Protected API routes
RBAC
Ownership checks
Rate limiting
CORS
Security headers
Validation
Error handling
Password recovery if enabled
Frontend auth state
Logout cache clearing
Browser back protection
Automated tests
```

---

# 69. Final Security Principle

Authentication determines identity.

Authorization determines access.

The backend enforces both.

The frontend improves the user experience but must never be treated as a security boundary.

```text id="q8m3x1"
Browser
   ↓
Authentication
   ↓
Authorization
   ↓
Validation
   ↓
Business Logic
   ↓
Database
```

Every protected operation must pass through the appropriate security boundaries before changing or exposing user data.
