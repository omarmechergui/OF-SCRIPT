# OFFSCRIPT — FEATURES & BUSINESS RULES

## 1. Document Purpose

This document defines the functional behavior, business rules, user flows, permissions, state transitions, and feature requirements of the OFFSCRIPT platform.

It is the product-level source of truth for feature behavior.

This document must be read before implementing or modifying any feature.

The implementation must follow:

```text
FEATURES.md
    ↓
UI / UX
    ↓
Frontend
    ↓
API
    ↓
Backend business logic
    ↓
Database
```

The frontend must never invent business rules that belong to the backend.

---

# 2. Product Overview

OFFSCRIPT is a technical learning and competition platform designed to help members:

* follow structured learning roadmaps
* complete technical sessions
* solve assignments
* build projects
* participate in competitions
* earn points
* unlock badges
* track progress
* build a technical profile
* demonstrate practical achievements

The platform combines:

```text
Learning
+ Practice
+ Projects
+ Competitions
+ Progress
+ Gamification
+ Technical Identity
```

The platform should feel:

* technical
* serious
* competitive
* modern
* structured
* premium
* motivating

It must not feel like a childish game.

---

# 3. User Types

## 3.1 Guest

A guest is not authenticated.

Guests can access:

* Home
* Roadmap
* Competitions
* Projects
* Badges
* Login
* Register

Guests cannot access member-specific data.

Protected actions require authentication.

---

## 3.2 Member

A member is an authenticated platform user.

Members can:

* view their dashboard
* follow the roadmap
* access available sessions
* complete sessions
* submit assignments
* work on projects
* participate in competitions
* earn points
* unlock badges
* view their profile
* edit their profile
* view their activity/history

Members can only modify resources they own unless an explicit permission allows otherwise.

---

## 3.3 Admin

Admins manage platform content and business configuration.

Admins may:

* manage users
* manage roadmap content
* manage sessions
* manage assignments
* manage projects
* manage competitions
* manage badges
* configure point rewards
* award points when authorized
* manage platform content
* review submissions
* manage competition states
* inspect activity
* manage system-level configuration

Admin capabilities must always be enforced by backend authorization.

---

# 4. Authentication Features

Authentication is defined in detail in `AUTH.md`.

Main flows:

```text
Register
Login
Logout
Current User
Forgot Password
Reset Password
Protected Routes
Role Authorization
```

---

# 5. Home Page

## Purpose

The Home page introduces OFFSCRIPT and directs users toward learning and participation.

## Main sections

The exact visual implementation belongs to `UI-UX.md`, but functional sections may include:

* platform introduction
* learning roadmap
* competitions
* projects
* badges
* call-to-action
* member/community value

## Guest behavior

Primary actions:

```text
Explore Roadmap
View Competitions
View Projects
Join OFFSCRIPT
Login
```

## Authenticated behavior

Authenticated users may see:

```text
Continue Learning
Go to Dashboard
View Progress
View Current Session
```

The Home page must not expose private member information.

---

# 6. Roadmap

## Purpose

The Roadmap provides the structured learning path.

Example:

```text
Semester 01
    Week 01
    Week 02
    Week 03
    ...
    Week 14
```

The roadmap supports:

* semesters
* weeks/modules
* sessions
* progress
* availability states
* completion states

---

## 6.1 Roadmap States

Each learning unit may have one of the following states:

```text
COMPLETED
CURRENT
AVAILABLE
LOCKED
```

### COMPLETED

The member has completed the required learning activity.

### CURRENT

The unit is currently active for the member.

### AVAILABLE

The unit can be accessed but is not the current unit.

### LOCKED

The unit cannot yet be accessed.

The backend determines availability.

---

## 6.2 Roadmap Progress

Example:

```text
Semester 01
78%
```

Progress must be calculated from actual completion data.

It must not be hard-coded in the frontend.

Example conceptual calculation:

```text
completed required units
------------------------ × 100
total required units
```

The exact business calculation must be implemented centrally.

---

## 6.3 Roadmap Access Rules

A member can access:

* completed content
* currently available content
* content explicitly unlocked for them

A locked unit must not become accessible merely because the frontend hides or disables a button.

Backend authorization must verify access.

---

# 7. Sessions

## Purpose

Sessions represent individual technical learning units.

Example:

```text
Week 14
API Authentication Testing
```

A session may contain:

* title
* description
* objectives
* content
* materials
* resources
* assignment
* estimated duration
* progress
* completion state
* reward configuration

---

## 7.1 Session States

A session can be:

```text
LOCKED
AVAILABLE
IN_PROGRESS
COMPLETED
```

---

## 7.2 Session Progress

Example:

```text
85%
```

Progress must be derived from actual user activity.

The frontend must not directly mark a session as completed without backend validation.

---

## 7.3 Session Completion

A session may be considered completed when its configured completion requirements are satisfied.

Completion can trigger:

```text
Session completion
    ↓
Backend validation
    ↓
Mark completion
    ↓
Award configured points
    ↓
Evaluate badge requirements
    ↓
Update roadmap progress
    ↓
Return updated state
```

The operation should be idempotent.

Completing the same session twice must not award duplicate points.

---

# 8. Assignments

## Purpose

Assignments provide practical exercises associated with learning content.

An assignment may include:

* title
* description
* instructions
* session
* deadline
* difficulty
* attachments
* submission requirements
* reward
* evaluation criteria
* status

---

# 8.1 Assignment States

Possible member-facing states:

```text
NOT_STARTED
IN_PROGRESS
SUBMITTED
UNDER_REVIEW
APPROVED
REJECTED
LATE
```

The exact state model must remain centralized.

---

# 8.2 Assignment Submission

Typical flow:

```text
Member opens assignment
        ↓
Reads instructions
        ↓
Prepares solution
        ↓
Submits
        ↓
Backend validates
        ↓
Submission stored
        ↓
Status updated
        ↓
Evaluation
        ↓
Points / progress / badges
```

The backend must validate:

* ownership
* assignment availability
* submission format
* required fields
* deadline rules
* duplicate submission rules

---

# 8.3 Assignment Resubmission

If enabled by the assignment configuration:

```text
REJECTED
    ↓
Member fixes work
    ↓
Resubmit
```

The backend must control whether resubmission is allowed.

The frontend must not assume unlimited attempts.

---

# 9. Projects

## Purpose

Projects allow members to demonstrate practical technical work.

Projects may include:

* title
* description
* difficulty
* technologies
* requirements
* deadline
* reward
* status
* progress
* submission
* evaluation

---

## 9.1 Project States

Possible states:

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

---

## 9.2 Project Progress

Example:

```text
Project Progress
65%
```

Progress should come from actual project activity/configuration.

Do not hard-code progress values.

---

## 9.3 Project Submission

Flow:

```text
Project
    ↓
Member works
    ↓
Member submits
    ↓
Backend validates
    ↓
Submission stored
    ↓
Review
    ↓
Approved / Rejected
    ↓
Points / badges / progress
```

The backend must prevent unauthorized submissions.

---

# 10. Competitions

## Purpose

Competitions provide technical challenges and competitive participation.

A competition may contain:

* title
* description
* rules
* start date
* end date
* registration deadline
* eligibility requirements
* participants
* timeline
* submission requirements
* evaluation
* rewards
* status

---

# 10.1 Competition States

Recommended lifecycle:

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

The backend controls state transitions.

---

# 10.2 Competition Registration

Member flow:

```text
Open Competition
        ↓
Check eligibility
        ↓
Register
        ↓
Backend validates
        ↓
Registration created
```

Registration must be idempotent.

A member cannot register twice for the same competition.

---

# 10.3 Competition Eligibility

Eligibility may depend on:

* authentication
* account status
* roadmap progress
* required badges
* required projects
* member role
* registration deadline
* competition capacity

Eligibility rules must be evaluated server-side.

---

# 10.4 Competition Submission

Only registered and eligible members may submit unless an explicit competition rule allows otherwise.

Submission flow:

```text
Member
  ↓
Competition
  ↓
Eligibility check
  ↓
Submission
  ↓
Validation
  ↓
Storage
  ↓
Evaluation
```

The backend must enforce submission deadlines.

---

# 11. Badges

## Purpose

Badges represent technical achievements.

Badges should feel like collectible technical credentials rather than generic game rewards.

---

# 11.1 Badge States

For the member:

```text
LOCKED
EARNED
```

---

# 11.2 Badge Unlocking

Badges may be triggered by:

* completing sessions
* completing roadmap milestones
* submitting assignments
* completing projects
* participating in competitions
* achieving configured point thresholds
* other admin-configured achievements

The backend evaluates badge eligibility.

The frontend only displays the resulting state.

---

# 11.3 Badge Idempotency

A badge must not be granted multiple times to the same member unless the business rule explicitly supports multiple instances.

---

# 12. Points System

## Purpose

Points measure member activity and achievements.

Points are not a hard-coded frontend value.

The backend is the source of truth.

---

# 12.1 Point Sources

Possible sources:

```text
Session Completion
Assignment Completion
Project Completion
Competition Participation
Competition Achievement
Contribution
Badge Bonus
Admin-Configured Activity
```

The system must support configurable reward values.

Example:

```text
Complete Session → +50
Submit Assignment → +25
Complete Project → +100
Competition → +75
```

These values are examples only.

Production values must come from backend configuration.

---

# 12.2 Point Awarding

Recommended flow:

```text
User action
    ↓
Backend validates action
    ↓
Business event confirmed
    ↓
Reward configuration loaded
    ↓
Points transaction created
    ↓
Member balance updated
    ↓
Badge/progress rules evaluated
```

---

# 12.3 Duplicate Reward Prevention

Critical reward actions must be idempotent.

For example:

```text
Complete Session
```

must not produce:

```text
+50
+50
+50
```

because the user clicked the completion button multiple times.

Instead:

```text
+50
```

must be recorded once.

---

# 12.4 Point History

Members can view a history of point transactions.

Example:

```text
+50   Completed Week 14
+100  Project 2
+75   Competition
+25   Assignment
```

Each transaction should contain enough information to explain:

* amount
* reason
* source
* timestamp
* related entity when applicable

---

# 12.5 Point Balance

The displayed point balance must originate from backend data.

Do not calculate the authoritative balance from frontend state alone.

---

# 13. My Points

The My Points page provides:

* current balance
* transaction history
* earning sources
* recent rewards
* optional statistics

Example:

```text
1,240
OFFSCRIPT Points
```

The page must support:

```text
Loading
Success
Empty
Error
```

---

# 14. Dashboard

## Purpose

The Dashboard is the member's primary command center.

Example:

```text
WELCOME BACK, JIHED

Keep building.
Keep breaking.

1,240
OFFSCRIPT Points

Semester 01
78%

Week 14
API Authentication Testing

Continue Learning
```

---

## 14.1 Dashboard Data

The dashboard may contain:

* welcome message
* current learning unit
* roadmap progress
* points
* badges
* active assignments
* active projects
* upcoming competitions
* recent activity
* achievements

---

## 14.2 Continue Learning

The Continue Learning action must point to the member's actual next relevant learning unit.

It must not use a static destination.

---

## 14.3 Dashboard Source of Truth

Dashboard values must come from backend APIs.

Examples:

```text
Points → backend
Progress → backend
Current session → backend
Badges → backend
Assignments → backend
Projects → backend
Competitions → backend
```

---

# 15. Profile

## Purpose

The profile represents the member's technical identity.

Profile data may include:

* avatar
* username
* full name
* email
* bio
* points
* progress
* badges
* projects
* competitions
* activity statistics

---

# 15.1 Profile Editing

Members may edit fields allowed by the backend.

Typical editable fields:

* avatar
* full name
* bio
* selected profile information

Sensitive account information must follow authentication/security rules.

---

# 15.2 Profile Ownership

A member can modify their own profile.

Admin users may modify member profiles only when authorized.

---

# 16. Navigation

## Guest Navigation

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

---

## Authenticated Navigation

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

# 16.1 Profile Menu

The profile dropdown may contain:

```text
My Dashboard
My Profile
My Badges
My Points
----------------
Logout
```

Logout must be visually and behaviorally distinct from navigation.

---

# 17. Logout

Logout is a security-sensitive operation.

Required behavior:

```text
User clicks Logout
        ↓
Logout request
        ↓
Server invalidates/clears authentication state
        ↓
Frontend clears authenticated state
        ↓
Frontend clears relevant cached private data
        ↓
Redirect to public page
```

After logout:

* protected pages must not remain accessible
* protected API requests must fail
* browser Back must not expose private content
* stale cached member data must not remain visible
* navigation must update to guest state

Logout must work on mobile.

---

# 18. Notifications

The platform may support notifications for:

* assignment deadlines
* competition events
* project reviews
* badge achievements
* point rewards
* roadmap updates
* administrative announcements

Notifications should support:

```text
UNREAD
READ
```

The backend controls notification state.

---

# 19. File Management

Files may be associated with:

* assignments
* projects
* competitions
* profile avatars
* learning materials

Storage uses Cloudflare R2.

The backend must validate:

* file type
* file size
* ownership
* upload authorization
* filename handling
* storage path
* access permissions

Private files must not become publicly accessible simply because a URL exists.

---

# 20. Admin Content Management

Admins may manage:

```text
Roadmaps
Sessions
Assignments
Projects
Competitions
Badges
Rewards
Users
```

CRUD operations must include:

```text
Create
Read
Update
Delete
```

where applicable.

Destructive operations should require appropriate confirmation and backend authorization.

---

# 21. Admin Reward Configuration

Admins should configure reward rules rather than frontend developers hard-coding them.

Example configuration:

```text
Activity:
SESSION_COMPLETION

Reward:
50 points

Enabled:
true
```

Possible reward configuration fields:

```text
event
points
enabled
description
badge trigger
```

The exact model may evolve during database design.

---

# 22. User Activity

The platform may track meaningful member activity such as:

* session completion
* assignment submission
* project submission
* competition registration
* competition submission
* badge unlock
* point reward

Activity data can support:

* dashboard
* profile
* notifications
* analytics
* auditability

Only meaningful events should be recorded.

Do not generate unnecessary activity records.

---

# 23. Search and Filtering

Where collections become large, the UI should support appropriate:

* search
* filtering
* sorting
* pagination

Examples:

```text
Projects → search by title/technology
Competitions → filter by status
Badges → filter earned/locked
Assignments → filter status
```

Filtering must not expose unauthorized records.

---

# 24. Loading States

Every data-driven feature must support a loading state.

Examples:

```text
Dashboard Loading
Roadmap Loading
Projects Loading
Competitions Loading
Badges Loading
Profile Loading
```

Use meaningful skeletons or loading indicators.

Avoid excessive animation.

---

# 25. Empty States

Every collection page must define an empty state.

Examples:

```text
No assignments yet.

No competitions available.

No badges earned yet.

No point history yet.

No projects available.
```

Empty state must explain what happened and, when useful, provide a next action.

---

# 26. Error States

Errors must be handled explicitly.

Examples:

```text
Failed to load dashboard.
Unable to submit assignment.
Competition registration failed.
Session could not be completed.
```

Users should receive useful messages without exposing:

* stack traces
* database errors
* secrets
* internal implementation details

---

# 27. Form Validation

All forms must support:

```text
Default
Focus
Validation
Error
Loading
Success
Disabled
```

Validation must happen on both:

```text
Frontend
Backend
```

Frontend validation improves UX.

Backend validation protects the system.

The backend remains authoritative.

---

# 28. Authorization Rules

Authentication answers:

```text
Who are you?
```

Authorization answers:

```text
What are you allowed to do?
```

Every protected operation must evaluate authorization.

Examples:

```text
Member → own profile
Member → own submissions
Member → eligible competition
Admin → user management
Admin → content management
```

---

# 29. Ownership / IDOR Prevention

The API must never assume that knowing an ID grants access.

Bad:

```text
PATCH /api/projects/:id
```

and automatically allowing the request.

Correct:

```text
Authenticate
    ↓
Authorize
    ↓
Verify ownership/permission
    ↓
Validate request
    ↓
Execute action
```

This applies to:

* profiles
* submissions
* projects
* assignments
* competitions
* files
* points
* badges
* notifications

---

# 30. Business Event Model

Important actions should be treated as business events.

Examples:

```text
SESSION_COMPLETED
ASSIGNMENT_SUBMITTED
ASSIGNMENT_APPROVED
PROJECT_SUBMITTED
PROJECT_COMPLETED
COMPETITION_REGISTERED
COMPETITION_SUBMITTED
BADGE_EARNED
POINTS_AWARDED
```

Events can trigger secondary effects.

Example:

```text
SESSION_COMPLETED
        ↓
Progress update
        ↓
Points
        ↓
Badge evaluation
        ↓
Notification
```

---

# 31. Transactional Consistency

When one action modifies multiple related records, consistency must be considered.

Example:

```text
Complete Session
    ↓
Session completion record
    ↓
Point transaction
    ↓
Progress update
    ↓
Badge evaluation
```

The implementation must prevent partially completed reward operations.

Where supported and appropriate, use database transactions or equivalent consistency mechanisms.

---

# 32. Idempotency

The following actions should be designed to be idempotent where applicable:

```text
Session completion
Point awarding
Badge unlocking
Competition registration
Submission operations
```

Example:

```text
POST /sessions/123/complete
```

Repeated calls must not unintentionally create duplicate completion records or rewards.

---

# 33. Data Ownership

The backend owns:

```text
Authentication
Authorization
Points
Progress
Badges
Competition state
Assignment state
Project state
Reward configuration
Eligibility
Submission state
```

The frontend owns:

```text
Presentation
Interaction
Local UI state
Form state
Temporary client state
```

The frontend does not own authoritative business data.

---

# 34. Feature Dependency Model

Major dependencies:

```text
Authentication
      ↓
Member Identity
      ↓
Roadmap
      ↓
Sessions
      ↓
Assignments
      ↓
Projects
      ↓
Competitions
      ↓
Points
      ↓
Badges
      ↓
Profile / Dashboard
```

Not every feature must strictly depend on the previous one, but these relationships must be respected where business rules require them.

---

# 35. Member Journey

Primary journey:

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Roadmap
   ↓
Session
   ↓
Assignment
   ↓
Project
   ↓
Competition
   ↓
Points
   ↓
Badges
   ↓
Profile
```

The platform should make the next meaningful action obvious.

---

# 36. Critical User Flows

## 36.1 Register

```text
Register
→ Validate form
→ API
→ Validate backend
→ Create user
→ Establish authentication
→ Redirect to member experience
```

---

## 36.2 Login

```text
Login
→ Validate credentials
→ Rate-limit protection
→ Authenticate
→ Set secure HTTP-only cookie
→ Fetch current user
→ Redirect
```

---

## 36.3 Logout

```text
Logout
→ API
→ Clear server auth state
→ Clear frontend state
→ Clear private cache
→ Redirect
→ Protect routes
```

---

## 36.4 Continue Learning

```text
Dashboard
→ Fetch member progress
→ Determine current/next session
→ Continue Learning
→ Session
```

---

## 36.5 Complete Session

```text
Session
→ Complete
→ Backend validation
→ Completion record
→ Reward
→ Progress
→ Badge evaluation
→ UI refresh
```

---

## 36.6 Submit Assignment

```text
Assignment
→ Prepare work
→ Submit
→ Validate
→ Store submission
→ Update status
→ Review
```

---

## 36.7 Complete Project

```text
Project
→ Work
→ Submit
→ Review
→ Approve
→ Complete
→ Reward
→ Badge evaluation
```

---

## 36.8 Register for Competition

```text
Competition
→ Check eligibility
→ Register
→ Prevent duplicate registration
→ Confirm participation
```

---

## 36.9 Earn Badge

```text
Member action
→ Backend event
→ Evaluate requirements
→ Badge earned
→ Persist achievement
→ Award optional bonus
→ Notify member
```

---

# 37. Responsive Feature Requirements

All features must work on:

```text
Desktop
Tablet
Mobile
```

Important actions must remain accessible on small screens.

No critical page should require horizontal scrolling.

Forms must remain usable on mobile.

Navigation must provide a clear mobile experience.

---

# 38. Accessibility Requirements

Interactive components must support:

* keyboard navigation
* visible focus states
* semantic HTML
* accessible labels
* appropriate contrast
* screen-reader-friendly controls
* accessible form errors

Do not rely only on color to communicate status.

Examples:

```text
COMPLETED
LOCKED
ERROR
SUCCESS
```

should have text/icon/state cues in addition to color.

---

# 39. Performance Requirements

Feature implementation should avoid unnecessary:

* API requests
* database queries
* re-renders
* duplicate submissions
* large client-side datasets

Use:

```text
TanStack Query
pagination
caching
query invalidation
server-side filtering
```

where appropriate.

---

# 40. Security Requirements

Feature implementations must respect:

* JWT HTTP-only cookies
* Argon2id
* RBAC
* ownership checks
* Zod validation
* explicit CORS
* rate limiting
* Helmet
* secure file handling
* secure cookies
* HTTPS in production
* no secrets in source control

Never trust:

```text
Frontend role
Frontend points
Frontend progress
Frontend competition state
Frontend badge state
Frontend ownership
```

---

# 41. Anti-Patterns

The following are prohibited:

## Hard-coded user data

Bad:

```javascript
const points = 1240;
```

Use backend data.

---

## Hard-coded progress

Bad:

```javascript
const progress = 78;
```

Use actual progress.

---

## Frontend-only authorization

Bad:

```javascript
if (user.role === "ADMIN") {
    showAdminButton();
}
```

This can improve UI, but backend authorization is still mandatory.

---

## Fake completion

Bad:

```text
Click button
→ immediately show completed
```

without backend confirmation.

---

## Duplicate rewards

Bad:

```text
Repeated click
→ repeated point reward
```

---

## Fake loading

Do not create artificial delays simply to make the application appear sophisticated.

---

## Dead buttons

Every production button must either:

* perform its intended action
* navigate to a valid destination
* open a real interaction
* or be clearly disabled because the feature is unavailable

---

## Placeholder production features

Do not leave:

```text
TODO
Coming soon
Lorem ipsum
Fake statistics
Fake points
Fake progress
Fake badges
```

where real functionality is expected.

---

# 42. Feature Testing Requirements

Each feature should have tests appropriate to its risk.

## Unit tests

Use Vitest for:

* reward calculations
* progress calculations
* eligibility logic
* badge rules
* state transitions
* validation
* business rules

---

## API tests

Use Supertest for:

* authentication
* authorization
* CRUD
* ownership
* submissions
* points
* badges
* competition registration
* error handling

---

## E2E tests

Use Playwright for critical flows:

```text
Register
Login
Logout
Protected route
Browser Back after logout
Roadmap navigation
Session completion
Assignment submission
Project submission
Competition registration
Points update
Badge unlock
Profile update
```

---

# 43. Feature Definition of Done

A feature is not complete when the UI exists.

A feature is complete when applicable requirements are satisfied:

```text
[ ] Product behavior defined
[ ] UI implemented
[ ] Responsive behavior implemented
[ ] Frontend validation
[ ] Backend validation
[ ] Authentication
[ ] Authorization
[ ] Ownership checks
[ ] API integration
[ ] Database persistence
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] Success state
[ ] Duplicate-action protection
[ ] Business logic tested
[ ] API tested
[ ] E2E tested when critical
[ ] No fake data
[ ] No dead buttons
[ ] No secrets
[ ] No console/debug leftovers
[ ] Lint passes
[ ] Build passes
[ ] Regression checked
```

---

# 44. Implementation Rule

Before implementing a feature, the AI coding agent must identify:

```text
1. User story
2. Business rules
3. Required states
4. Required permissions
5. Data involved
6. API endpoints
7. Backend logic
8. Frontend components
9. Validation
10. Error cases
11. Loading/empty/success states
12. Tests
```

Then inspect the existing implementation before modifying files.

---

# 45. AI Coding Agent Feature Workflow

Every feature must follow:

```text
UNDERSTAND
    ↓
INSPECT
    ↓
PLAN
    ↓
IMPLEMENT
    ↓
TEST
    ↓
VERIFY
    ↓
REPORT
```

The agent must not immediately start editing files without understanding the existing architecture.

---

# 46. Bug Workflow

When fixing a bug, the agent must first explain:

```text
1. What the error means
2. Root cause
3. Why it happened
4. Exact location
5. Possible solutions
6. Trade-offs
7. Recommended solution
```

Then:

```text
Implement
→ Test
→ Verify
→ Check regression
→ Report
```

Do not patch only the visible symptom if the underlying business rule is incorrect.

---

# 47. Feature Change Rule

When modifying an existing feature, inspect the complete flow:

```text
UI
 ↓
Page
 ↓
Hook
 ↓
API client
 ↓
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

Then verify the reverse flow:

```text
Database
 ↓
Service
 ↓
Controller
 ↓
API response
 ↓
TanStack Query
 ↓
Frontend state
 ↓
UI
```

---

# 48. Final Product Rule

OFFSCRIPT must never rely on the appearance of functionality.

The system must behave correctly.

```text
Real Data
+ Real API
+ Real Authorization
+ Real Business Logic
+ Real Persistence
+ Real Testing
= Production Feature
```

A polished UI without correct backend behavior is not considered complete.

---

# 49. Final Feature Architecture

```text
                         OFFSCRIPT
                              │
          ┌───────────────────┴───────────────────┐
          │                                       │
       LEARNING                              COMPETITION
          │                                       │
     ┌────┼────┐                           ┌──────┴──────┐
     │    │    │                           │             │
  Roadmap Session Assignment          Registration   Submission
     │      │       │                       │             │
     └──────┴───────┴───────────────────────┴─────────────┘
                              │
                           Projects
                              │
                              ↓
                         Achievements
                              │
                  ┌───────────┴───────────┐
                  │                       │
                Points                  Badges
                  │                       │
                  └───────────┬───────────┘
                              ↓
                         Member Profile
                              │
                              ↓
                          Dashboard
```

---

# 50. Final Product Contract

OFFSCRIPT features must follow these principles:

```text
Backend is authoritative.
Users own their personal work.
Admins control platform configuration.
Rewards come from real actions.
Progress comes from real completion.
Badges come from real achievements.
Competition states come from backend rules.
Frontend never bypasses authorization.
Critical actions are protected against duplication.
Every important feature has loading/error/empty/success states.
Every critical flow is tested.
```

This document is the functional foundation for the next design and implementation phases.
