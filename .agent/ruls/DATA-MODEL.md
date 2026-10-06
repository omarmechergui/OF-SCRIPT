# OFFSCRIPT — DATA MODEL

## 1. Document Purpose

This document defines the OFFSCRIPT database model, entities, relationships, constraints, indexes, lifecycle states, ownership rules, and data integrity requirements.

It is the data-model source of truth before implementing:

```text
prisma/schema.prisma
```

The implementation must follow:

```text
FEATURES.md
      ↓
DATA-MODEL.md
      ↓
Prisma Schema
      ↓
Services
      ↓
Controllers
      ↓
API
      ↓
Frontend
```

The database must represent real product state.

The frontend must never become the source of truth for:

* points
* progress
* badges
* permissions
* competition state
* submission state
* eligibility
* completion state

---

# 2. Database Technology

OFFSCRIPT uses:

```text
Database:
MongoDB

Hosting:
MongoDB Atlas

ORM:
Prisma

ODM:
None

Raw SQL:
Not applicable
```

Prisma is the application's database access layer.

Do not introduce Mongoose.

---

# 3. Data Modeling Principles

The model must prioritize:

```text
Consistency
Integrity
Ownership
Traceability
Idempotency
Scalability
Queryability
Security
```

Important business actions must produce persistent records.

Examples:

```text
Session completion
Assignment submission
Project submission
Competition registration
Point award
Badge unlock
Profile update
```

---

# 4. Domain Model Overview

The OFFSCRIPT database is divided into the following domains:

```text
┌───────────────────────────────────────────────┐
│                    USER                       │
│             Authentication / RBAC             │
└──────────────────────┬────────────────────────┘
                       │
        ┌──────────────┼───────────────┐
        ↓              ↓               ↓
     Learning       Profile          Activity
        │
   ┌────┼───────────────┐
   ↓    ↓               ↓
Semester → Week → Session
                   │
                   ↓
               Assignment
                   │
                   ↓
                Submission

        Learning / Practice
              │
              ↓
           Project
              │
              ↓
          Submission

        Competition
              │
       ┌──────┴──────┐
       ↓             ↓
 Registration      Submission

        Achievement
              │
       ┌──────┴──────┐
       ↓             ↓
    Points          Badges

        Supporting
              │
       ┌──────┼───────────┐
       ↓      ↓           ↓
     Files Notifications Audit
```

---

# 5. Core Entities

The initial domain model includes:

```text
User
Role

Semester
Week
Session
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

File
Notification
AuditLog
```

Additional entities may be introduced only when a real business requirement requires them.

Do not create unnecessary collections.

---

# 6. User Model

## 6.1 User

The `User` entity represents a platform account.

Core fields:

```text
id
username
email
passwordHash
role
status
avatar
fullName
bio
createdAt
updatedAt
```

Possible additional security fields:

```text
emailVerified
lastLoginAt
passwordChangedAt
```

The exact authentication fields must remain compatible with `AUTH.md`.

---

# 7. User Identity Rules

## Username

Username should be unique.

```text
unique(username)
```

Rules:

* normalized where appropriate
* case handling must be consistent
* empty usernames are invalid
* duplicate usernames are rejected

---

## Email

Email should be unique.

```text
unique(email)
```

Store normalized email values consistently.

Recommended normalization:

```text
trim
lowercase
```

before persistence.

---

# 8. User Role

The role determines authorization.

The role model must support:

```text
MEMBER
ADMIN
```

If additional roles are introduced later, authorization rules must be updated centrally.

Do not scatter role logic throughout controllers.

---

# 9. User Status

Recommended account states:

```text
ACTIVE
INACTIVE
SUSPENDED
```

Optional:

```text
PENDING_VERIFICATION
```

The backend must prevent suspended/inactive users from performing restricted actions.

---

# 10. User Ownership

User-owned resources must reference their owner.

Examples:

```text
AssignmentSubmission.userId
ProjectSubmission.userId
CompetitionRegistration.userId
CompetitionSubmission.userId
SessionProgress.userId
UserBadge.userId
PointTransaction.userId
Notification.userId
```

Never infer ownership from frontend state.

---

# 11. Learning Hierarchy

OFFSCRIPT learning follows:

```text
Semester
    ↓
Week
    ↓
Session
```

This hierarchy should remain explicit in the database.

---

# 12. Semester

A `Semester` represents a major learning period.

Core fields:

```text
id
title
description
order
status
createdAt
updatedAt
```

Example:

```text
Semester 01
```

---

## 12.1 Semester Ordering

Semesters should have deterministic ordering.

Example:

```text
order = 1
order = 2
order = 3
```

The frontend must not determine semester ordering.

---

# 13. Week

A `Week` belongs to a semester.

Core fields:

```text
id
semesterId
title
description
order
status
createdAt
updatedAt
```

Relationship:

```text
Semester 1
    │
    ├── Week 1
    ├── Week 2
    ├── Week 3
    └── Week 14
```

---

## 13.1 Week Ordering

Ordering must be deterministic within a semester.

Recommended uniqueness:

```text
unique(semesterId, order)
```

---

# 14. Session

A `Session` belongs to a week.

Core fields:

```text
id
weekId
title
slug
description
content
order
status
estimatedMinutes
createdAt
updatedAt
```

Optional:

```text
objectives
materials
resources
```

The exact representation can evolve based on content requirements.

---

# 15. Session Status

Recommended content states:

```text
DRAFT
PUBLISHED
ARCHIVED
```

Member access state is different from content status.

Do not mix:

```text
PUBLISHED
```

with:

```text
COMPLETED
LOCKED
```

The first describes content lifecycle.

The second describes member progress/access.

---

# 16. Session Progress

`SessionProgress` represents an individual member's progress through a session.

Fields:

```text
id
userId
sessionId
progress
status
startedAt
completedAt
createdAt
updatedAt
```

Recommended status:

```text
NOT_STARTED
IN_PROGRESS
COMPLETED
```

---

## 16.1 Session Progress Uniqueness

A user should have only one active progress record per session.

```text
unique(userId, sessionId)
```

This prevents:

```text
User A + Session 14
User A + Session 14
User A + Session 14
```

from becoming multiple progress records.

---

# 17. Session Progress Rules

Progress must satisfy:

```text
0 <= progress <= 100
```

Completion should be represented consistently.

Recommended:

```text
status = COMPLETED
progress = 100
completedAt != null
```

Do not allow contradictory states such as:

```text
status = COMPLETED
progress = 40
```

unless there is an explicit business reason.

---

# 18. Assignment

An `Assignment` represents a practical task.

Fields:

```text
id
sessionId
title
slug
description
instructions
status
difficulty
deadline
maxAttempts
createdAt
updatedAt
```

Optional:

```text
rewardRuleId
```

or a relationship to reward configuration.

---

# 19. Assignment Status

Recommended content lifecycle:

```text
DRAFT
PUBLISHED
ARCHIVED
```

Member submission status belongs to `AssignmentSubmission`.

Do not store member-specific submission state directly on the Assignment.

---

# 20. Assignment Submission

A submission belongs to:

```text
User
Assignment
```

Fields:

```text
id
assignmentId
userId
content
status
attemptNumber
submittedAt
reviewedAt
reviewedBy
feedback
createdAt
updatedAt
```

Optional:

```text
fileId
score
```

---

# 21. Assignment Submission Status

Recommended:

```text
SUBMITTED
UNDER_REVIEW
APPROVED
REJECTED
```

Optional:

```text
LATE
```

Late status must follow the assignment deadline rules.

---

# 22. Assignment Attempt Rules

If multiple attempts are supported:

```text
unique(assignmentId, userId, attemptNumber)
```

This allows:

```text
User A
Assignment X
Attempt 1

User A
Assignment X
Attempt 2
```

without duplicate attempt numbers.

The backend controls whether another attempt is allowed.

---

# 23. Project

A `Project` represents a larger practical development task.

Fields:

```text
id
title
slug
description
requirements
difficulty
status
deadline
createdAt
updatedAt
```

Optional:

```text
technologies
repositoryUrl
demoUrl
rewardRuleId
```

URLs must be validated before persistence.

---

# 24. Project Status

Recommended content/member lifecycle:

```text
DRAFT
PUBLISHED
ARCHIVED
```

Member-specific lifecycle belongs to progress/submission entities.

---

# 25. Project Progress

`ProjectProgress` tracks an individual member's progress.

Fields:

```text
id
userId
projectId
progress
status
startedAt
completedAt
createdAt
updatedAt
```

Recommended status:

```text
NOT_STARTED
IN_PROGRESS
COMPLETED
```

---

# 26. Project Progress Uniqueness

One user should have one progress record per project.

```text
unique(userId, projectId)
```

---

# 27. Project Submission

Fields:

```text
id
projectId
userId
content
status
submittedAt
reviewedAt
reviewedBy
feedback
createdAt
updatedAt
```

Optional:

```text
repositoryUrl
demoUrl
fileId
score
```

---

# 28. Project Submission Status

Recommended:

```text
SUBMITTED
UNDER_REVIEW
APPROVED
REJECTED
```

When a project is approved, the backend may:

```text
Complete project progress
Award configured points
Evaluate badge requirements
Create notification
```

These operations must be designed for consistency.

---

# 29. Competition

A `Competition` represents a technical challenge.

Fields:

```text
id
title
slug
description
rules
status
registrationStartAt
registrationEndAt
startAt
submissionEndAt
createdAt
updatedAt
```

Optional:

```text
capacity
eligibilityRules
rewardRuleId
```

---

# 30. Competition Status

Recommended:

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

State transitions must be controlled by backend business logic.

The frontend must not change competition status.

---

# 31. Competition Registration

A registration connects:

```text
User
Competition
```

Fields:

```text
id
userId
competitionId
status
registeredAt
createdAt
updatedAt
```

Recommended status:

```text
REGISTERED
CANCELLED
```

---

# 32. Competition Registration Uniqueness

A user cannot register multiple times for the same competition.

Required:

```text
unique(userId, competitionId)
```

This is a critical idempotency constraint.

---

# 33. Competition Registration Rules

Before registration, backend checks:

```text
User authenticated
User active
Competition available
Registration window open
Eligibility satisfied
User not already registered
Capacity available if applicable
```

---

# 34. Competition Submission

A submission belongs to:

```text
User
Competition
```

Fields:

```text
id
userId
competitionId
content
status
submittedAt
updatedAt
reviewedAt
reviewedBy
feedback
score
```

Optional:

```text
fileId
repositoryUrl
demoUrl
```

---

# 35. Competition Submission Rules

Before accepting a submission:

```text
User authenticated
User active
Competition active
User registered
Submission deadline not passed
Submission valid
```

The backend controls these rules.

---

# 36. Competition Submission Uniqueness

The model must define whether the competition allows:

```text
one submission
```

or:

```text
multiple submissions
```

If only one final submission is allowed:

```text
unique(userId, competitionId)
```

If multiple submissions are allowed, use an attempt/version model.

The chosen rule must be explicit in the implementation.

---

# 37. Badge

A `Badge` represents an achievement definition.

Fields:

```text
id
name
slug
description
icon
status
requirementType
requirementConfig
createdAt
updatedAt
```

Optional:

```text
rewardRuleId
```

---

# 38. Badge Requirements

Badge requirements must be configurable.

Possible types:

```text
SESSION_COMPLETION
ROADMAP_PROGRESS
ASSIGNMENT_COMPLETION
PROJECT_COMPLETION
COMPETITION_PARTICIPATION
POINT_THRESHOLD
CUSTOM
```

The requirement configuration must be interpreted by backend services.

Do not put badge eligibility logic in React components.

---

# 39. User Badge

`UserBadge` represents a badge earned by a specific member.

Fields:

```text
id
userId
badgeId
earnedAt
metadata
createdAt
```

---

# 40. User Badge Uniqueness

A user should not earn the same badge twice unless the business model explicitly supports repeatable achievements.

Required:

```text
unique(userId, badgeId)
```

---

# 41. Badge Unlocking

Badge evaluation should happen after relevant business events.

Example:

```text
PROJECT_COMPLETED
        ↓
Evaluate badges
        ↓
Requirement satisfied
        ↓
Create UserBadge
        ↓
Optional point bonus
        ↓
Notification
```

Badge awarding must be idempotent.

---

# 42. Reward Rule

`RewardRule` defines configurable point rewards.

Fields:

```text
id
event
points
enabled
description
createdAt
updatedAt
```

Examples:

```text
SESSION_COMPLETION
ASSIGNMENT_APPROVED
PROJECT_COMPLETED
COMPETITION_PARTICIPATION
BADGE_EARNED
```

---

# 43. Reward Configuration

Reward values must not be hard-coded in frontend code.

Bad:

```javascript
const reward = 50;
```

Correct:

```text
Business Event
      ↓
RewardRule
      ↓
Configured Points
```

Admins may manage reward configuration according to authorization rules.

---

# 44. Point Transaction

`PointTransaction` is the authoritative points ledger.

Fields:

```text
id
userId
amount
event
description
sourceType
sourceId
createdAt
```

Optional:

```text
metadata
createdBy
idempotencyKey
```

---

# 45. Point Ledger Principle

Points should be traceable.

Example:

```text
User
  ↓
+50
SESSION_COMPLETION
Session 14
```

The system should be able to answer:

```text
Why did this user receive these points?
When?
From which action?
Which resource caused it?
```

---

# 46. Point Balance

The authoritative balance must come from backend-controlled data.

Possible implementation strategies:

### Strategy A — Ledger-derived balance

Calculate:

```text
SUM(PointTransaction.amount)
```

Advantages:

* strongest auditability
* single source of truth
* easy historical reconstruction

Trade-off:

* aggregation can become expensive at very large scale

### Strategy B — Cached balance

Store a balance on the User or dedicated account model while keeping the ledger.

Advantages:

* fast reads

Trade-off:

* requires strict consistency between balance and ledger

Recommended approach:

```text
PointTransaction = authoritative ledger
Balance = derived/cached value only when needed for performance
```

The implementation must never lose ledger records.

---

# 47. Point Transaction Idempotency

Critical reward operations should use an idempotency mechanism.

Example:

```text
userId
event
sourceType
sourceId
```

can form a logical uniqueness boundary for one-time rewards.

Example:

```text
User A
SESSION_COMPLETION
Session 14
```

must not create multiple identical reward transactions.

---

# 48. File

`File` represents an uploaded file.

Storage provider:

```text
Cloudflare R2
```

Fields may include:

```text
id
ownerId
originalName
storageKey
mimeType
size
visibility
createdAt
updatedAt
```

Optional:

```text
checksum
```

---

# 49. File Ownership

Every private file must have an owner or explicit resource relationship.

Do not rely only on the storage URL.

Backend authorization must validate access before returning protected files.

---

# 50. Notification

`Notification` represents a user-facing notification.

Fields:

```text
id
userId
type
title
message
readAt
createdAt
```

Recommended:

```text
readAt = null
```

means unread.

---

# 51. Notification Types

Possible:

```text
ASSIGNMENT_DEADLINE
PROJECT_REVIEW
COMPETITION
BADGE_EARNED
POINTS_AWARDED
ROADMAP
SYSTEM
```

Types should remain centralized.

---

# 52. Audit Log

`AuditLog` provides administrative/security traceability.

Fields:

```text
id
actorUserId
action
entityType
entityId
metadata
createdAt
```

Possible actions:

```text
USER_CREATED
USER_UPDATED
USER_SUSPENDED
REWARD_CHANGED
POINTS_AWARDED
BADGE_AWARDED
CONTENT_CREATED
CONTENT_UPDATED
CONTENT_DELETED
COMPETITION_UPDATED
```

Sensitive metadata must be handled carefully.

Never store passwords or secrets.

---

# 53. Relationship Map

## User relationships

```text
User
 ├── SessionProgress
 ├── AssignmentSubmission
 ├── ProjectProgress
 ├── ProjectSubmission
 ├── CompetitionRegistration
 ├── CompetitionSubmission
 ├── UserBadge
 ├── PointTransaction
 ├── Notification
 ├── File
 └── AuditLog
```

---

## Learning relationships

```text
Semester
 └── Week
      └── Session
           ├── SessionProgress
           └── Assignment
                └── AssignmentSubmission
```

---

## Project relationships

```text
Project
 ├── ProjectProgress
 └── ProjectSubmission
```

---

## Competition relationships

```text
Competition
 ├── CompetitionRegistration
 └── CompetitionSubmission
```

---

## Achievement relationships

```text
Badge
 └── UserBadge

RewardRule
 └── PointTransaction
```

---

# 54. Referential Integrity

When deleting or modifying records, evaluate dependent data.

Examples:

```text
User
 ↓
Submissions
 ↓
Points
 ↓
Badges
 ↓
Notifications
```

Do not blindly cascade-delete valuable historical data.

---

# 55. Deletion Strategy

Prefer soft deletion/archive for important content.

Examples:

```text
Session
Assignment
Project
Competition
Badge
```

Recommended:

```text
status = ARCHIVED
```

rather than physical deletion when historical references matter.

---

# 56. User Deletion

User deletion requires special care because the account may be referenced by:

* submissions
* points
* badges
* notifications
* audit logs
* files
* progress records

The implementation should preserve necessary historical integrity.

A production account-deletion strategy must be defined before enabling destructive user deletion.

---

# 57. Content Ordering

Learning content requires deterministic ordering.

Recommended constraints:

```text
Semester:
unique(order)

Week:
unique(semesterId, order)

Session:
unique(weekId, order)
```

This prevents ambiguous roadmap ordering.

---

# 58. Slugs

Public content entities may use slugs:

```text
Session.slug
Assignment.slug
Project.slug
Competition.slug
Badge.slug
```

Recommended:

```text
unique(slug)
```

If slugs are scoped by parent entity, uniqueness should reflect that scope.

---

# 59. Indexing Strategy

Indexes must support actual application queries.

Recommended indexes include:

```text
User:
email
username
role
status

Week:
semesterId + order

Session:
weekId + order
status

SessionProgress:
userId + sessionId

Assignment:
sessionId
status
deadline

AssignmentSubmission:
userId + assignmentId
status
submittedAt

Project:
status

ProjectProgress:
userId + projectId

ProjectSubmission:
userId + projectId
status
submittedAt

Competition:
status
registrationStartAt
startAt

CompetitionRegistration:
userId + competitionId
competitionId + status

CompetitionSubmission:
userId + competitionId
competitionId + status

UserBadge:
userId + badgeId
userId + earnedAt

PointTransaction:
userId + createdAt
userId + event
sourceType + sourceId

Notification:
userId + readAt
userId + createdAt

AuditLog:
actorUserId + createdAt
entityType + entityId
```

Indexes must be validated against real query patterns.

Do not add dozens of speculative indexes.

---

# 60. MongoDB Object IDs

Prisma IDs must use a consistent MongoDB-compatible strategy.

The project should use Prisma's MongoDB ObjectId mapping consistently.

All relations must use compatible identifier types.

Do not mix arbitrary string IDs and ObjectIds without a deliberate reason.

---

# 61. Timestamps

Important entities should include:

```text
createdAt
updatedAt
```

Event/history records should include:

```text
createdAt
```

Business lifecycle events should store their relevant timestamp.

Examples:

```text
completedAt
submittedAt
registeredAt
earnedAt
reviewedAt
```

Do not rely on `updatedAt` to represent a business event.

---

# 62. Date and Time

Store timestamps in a consistent timezone strategy.

Recommended:

```text
UTC in database
```

Convert to the user's local timezone only for presentation.

Do not store ambiguous local-time strings for business events.

---

# 63. Enum Strategy

Use enums for controlled states where appropriate.

Examples:

```text
UserStatus
ContentStatus
SessionProgressStatus
SubmissionStatus
CompetitionStatus
RegistrationStatus
RewardEvent
NotificationType
```

Avoid free-form strings for states that require strict validation.

---

# 64. JSON Configuration

Some configurable structures may use JSON.

Appropriate examples:

```text
Badge.requirementConfig
Competition.eligibilityRules
PointTransaction.metadata
AuditLog.metadata
```

JSON must not become a replacement for relational structure.

If data is frequently queried, filtered, or joined, model it explicitly.

---

# 65. Progress Calculation

Progress must be based on real persisted activity.

Examples:

```text
Roadmap progress
Session completion
Project progress
```

The database must store enough information to reconstruct the calculation.

Never persist arbitrary frontend-generated percentages as authoritative values.

---

# 66. Roadmap Progress

Roadmap progress can be derived from:

```text
completed required sessions
/
total required sessions
```

The exact business calculation must be centralized in the backend.

If some sessions are optional, the model must identify them explicitly.

---

# 67. Project Progress

Project progress should not be manually changed by the frontend.

Possible sources:

```text
Milestones
Tasks
Submission state
Admin evaluation
```

If milestone-based progress is required later, a dedicated ProjectMilestone entity should be introduced instead of abusing the `progress` field.

---

# 68. Assignment Rewards

Assignment rewards must be tied to a real event.

Recommended event:

```text
ASSIGNMENT_APPROVED
```

rather than merely opening an assignment.

This prevents users from receiving achievement rewards without completing the required work.

---

# 69. Project Rewards

Project rewards should normally be triggered by the configured completion/approval event.

Example:

```text
PROJECT_APPROVED
        ↓
PointTransaction
        ↓
Badge evaluation
```

---

# 70. Competition Rewards

Competition rewards must follow explicit competition rules.

Participation rewards and achievement rewards should be distinguishable.

Examples:

```text
COMPETITION_PARTICIPATION
COMPETITION_WIN
COMPETITION_PLACEMENT
```

Do not automatically award winner-style rewards simply because a member registered.

---

# 71. Badge Rewards

If badges grant bonus points:

```text
Badge Earned
      ↓
RewardRule
      ↓
PointTransaction
```

The reward must be protected against duplicate execution.

---

# 72. State Separation

Do not combine unrelated states into one field.

Bad:

```text
status = "COMPLETED"
```

for every possible concept.

Instead distinguish:

```text
Content status
Member progress status
Submission status
Competition lifecycle status
Account status
```

This avoids contradictory business logic.

---

# 73. Example Lifecycle

## Session

```text
DRAFT
  ↓
PUBLISHED
  ↓
Member starts
  ↓
IN_PROGRESS
  ↓
COMPLETED
```

`PUBLISHED` belongs to content.

`IN_PROGRESS` and `COMPLETED` belong to `SessionProgress`.

---

# 74. Example Assignment Lifecycle

```text
Assignment:
DRAFT
  ↓
PUBLISHED
  ↓
ARCHIVED

Member:
NOT_STARTED
  ↓
SUBMITTED
  ↓
UNDER_REVIEW
  ↓
APPROVED / REJECTED
```

---

# 75. Example Project Lifecycle

```text
Project:
DRAFT
  ↓
PUBLISHED
  ↓
ARCHIVED

Member:
NOT_STARTED
  ↓
IN_PROGRESS
  ↓
SUBMITTED
  ↓
UNDER_REVIEW
  ↓
APPROVED / REJECTED
```

---

# 76. Example Competition Lifecycle

```text
DRAFT
  ↓
UPCOMING
  ↓
REGISTRATION_OPEN
  ↓
REGISTRATION_CLOSED
  ↓
ACTIVE
  ↓
SUBMISSION_CLOSED
  ↓
UNDER_REVIEW
  ↓
COMPLETED
```

Cancellation may occur according to administrative rules.

---

# 77. Idempotency Model

Critical operations must have a database-level uniqueness boundary wherever possible.

Examples:

```text
Session completion:
unique(userId, sessionId)

Competition registration:
unique(userId, competitionId)

Badge:
unique(userId, badgeId)

Project progress:
unique(userId, projectId)

Session progress:
unique(userId, sessionId)
```

Point rewards require an equivalent logical uniqueness mechanism.

---

# 78. Concurrency

The system must consider concurrent requests.

Example:

```text
User double-clicks Complete
        +
Network retries
        +
Multiple browser requests
```

The backend must still produce:

```text
One completion
One reward
```

where the business rule is one-time.

Application-level checks alone are insufficient when a database uniqueness constraint can enforce the rule.

---

# 79. Data Integrity Rules

The following must never be accepted:

```text
Negative progress
Progress > 100
Duplicate registration
Duplicate badge
Duplicate session progress
Invalid ownership
Reward without valid source
Submission for unauthorized user
Submission after forbidden deadline
```

Validation should exist at:

```text
API boundary
Business service
Database constraints where possible
```

---

# 80. Security-Sensitive Data

Never store:

```text
Plaintext passwords
JWT secrets
API keys
Cloudflare secrets
Private credentials
```

Passwords must be stored only as secure Argon2id hashes.

Secrets belong in environment configuration.

---

# 81. Sensitive Historical Data

Audit records and point transactions may contain sensitive information.

Access must be restricted.

Members should only see their own permitted data.

Admins should only access audit information according to their role.

---

# 82. API-to-Model Mapping

The API should expose business resources rather than database implementation details.

Example:

```text
GET /api/roadmap
```

may internally use:

```text
Semester
Week
Session
SessionProgress
```

The frontend should not need to understand MongoDB internals.

---

# 83. Service Layer Responsibility

Database access should primarily happen through services.

Recommended:

```text
Controller
    ↓
Service
    ↓
Prisma
    ↓
MongoDB
```

Controllers should not contain large database/business workflows.

---

# 84. Transaction / Consistency Boundary

For actions affecting multiple records, define the consistency boundary.

Example:

```text
Complete Session
        │
        ├── SessionProgress
        ├── PointTransaction
        ├── UserBadge
        └── Notification
```

The implementation must ensure that a failure cannot silently create an incomplete reward state.

MongoDB/Prisma transaction capabilities must be respected when implementing multi-document operations.

---

# 85. Denormalization

MongoDB allows denormalization, but OFFSCRIPT should not duplicate authoritative business data unnecessarily.

Example:

Do not maintain:

```text
User.points
PointTransaction.amount
```

without defining which one is authoritative.

Preferred:

```text
PointTransaction = ledger
```

and any cached balance is derived from it.

---

# 86. Pagination

Large collections must be paginated.

Examples:

```text
PointTransaction
Notification
AssignmentSubmission
ProjectSubmission
CompetitionSubmission
AuditLog
```

Do not return unlimited historical data.

---

# 87. Sorting

History collections should have deterministic sorting.

Recommended:

```text
createdAt DESC
```

or another explicit business ordering.

Always provide stable secondary sorting when needed.

---

# 88. Search

Searchable fields should be deliberately defined.

Examples:

```text
Project.title
Competition.title
Assignment.title
Session.title
Badge.name
User.username
```

Do not perform uncontrolled full-database scans.

---

# 89. Data Migration Rules

Any schema change must consider:

```text
Existing users
Existing submissions
Existing points
Existing badges
Existing progress
Existing competitions
```

Do not deploy a schema change that invalidates existing production data without a migration strategy.

---

# 90. Seed Data

Development seed data may exist.

Seed data must be:

```text
Clearly separated from production data
Deterministic where possible
Safe
Documented
```

Do not use fake production metrics.

---

# 91. Test Data

Tests should create isolated test records.

Tests must not depend on:

```text
Hard-coded production IDs
Real user accounts
Production points
Production submissions
```

---

# 92. Backup and Recovery

MongoDB Atlas production data should have an appropriate backup/recovery strategy.

The application must not assume that:

```text
Database = backup
```

Backups must be independently managed.

---

# 93. Schema Evolution

When changing a model:

```text
Inspect current schema
        ↓
Identify dependencies
        ↓
Plan migration/change
        ↓
Update Prisma schema
        ↓
Update services
        ↓
Update API
        ↓
Update frontend
        ↓
Run tests
        ↓
Verify existing data
```

Do not modify only the Prisma schema and assume the application is updated.

---

# 94. Prisma Rules

Use Prisma for:

```text
Queries
Creates
Updates
Deletes
Relations
Transactions
```

Do not introduce another database abstraction without a documented architectural reason.

The Prisma schema must remain readable and organized by domain.

---

# 95. Suggested Prisma Schema Organization

Recommended conceptual ordering:

```text
// Enums

// User / Auth

// Learning

// Assignments

// Projects

// Competitions

// Achievements

// Rewards

// Supporting Models
```

Keep related models together.

---

# 96. Data Model Anti-Patterns

Do not:

```text
❌ Store passwords in plaintext
❌ Store points only in frontend state
❌ Store fake progress
❌ Allow duplicate registrations
❌ Allow duplicate badges
❌ Mix content and member status
❌ Use uncontrolled JSON for everything
❌ Create unnecessary collections
❌ Delete historical data blindly
❌ Trust frontend ownership
❌ Trust frontend roles
❌ Trust frontend rewards
❌ Return unlimited collections
❌ Add speculative indexes everywhere
```

---

# 97. Data Model Definition of Done

Before implementing `schema.prisma`:

```text
[ ] All core entities identified
[ ] Relationships defined
[ ] Ownership defined
[ ] States separated correctly
[ ] Unique constraints identified
[ ] Idempotency boundaries identified
[ ] Indexes identified
[ ] Timestamp strategy defined
[ ] Enum strategy defined
[ ] Points ledger defined
[ ] Reward rules defined
[ ] Badge model defined
[ ] Progress model defined
[ ] Submission models defined
[ ] Competition lifecycle defined
[ ] File ownership defined
[ ] Notification model defined
[ ] Audit model defined
[ ] Deletion strategy defined
[ ] Pagination requirements defined
[ ] Security-sensitive data identified
[ ] Existing-data compatibility considered
```

---

# 98. Final Entity Map

```text
USER
│
├── SessionProgress
│       └── Session
│
├── AssignmentSubmission
│       └── Assignment
│               └── Session
│
├── ProjectProgress
│       └── Project
│
├── ProjectSubmission
│       └── Project
│
├── CompetitionRegistration
│       └── Competition
│
├── CompetitionSubmission
│       └── Competition
│
├── UserBadge
│       └── Badge
│
├── PointTransaction
│       └── RewardRule
│
├── Notification
│
├── File
│
└── AuditLog


SEMESTER
└── WEEK
    └── SESSION
        └── ASSIGNMENT
```

---

# 99. Final Data Architecture

The OFFSCRIPT data architecture follows:

```text
                         USER
                          │
            ┌─────────────┼─────────────┐
            │             │             │
            ↓             ↓             ↓
        LEARNING      PRACTICE      COMPETITION
            │             │             │
            ↓             ↓             ↓
       Session       Assignment     Registration
       Progress      Submission     Submission
            │             │             │
            └─────────────┼─────────────┘
                          ↓
                     ACHIEVEMENTS
                          │
                ┌─────────┴─────────┐
                ↓                   ↓
             POINTS               BADGES
                │                   │
                └─────────┬─────────┘
                          ↓
                    MEMBER PROFILE
                          │
                          ↓
                       DASHBOARD
```

---

# 100. Final Data Principles

OFFSCRIPT database design must follow these rules:

```text
MongoDB is the database.
Prisma is the ORM.
Mongoose is not used.
Backend is authoritative.
User ownership is explicit.
Business states are separated.
Progress is based on real activity.
Points are represented by a ledger.
Rewards are configurable.
Badges are idempotent.
Registrations are idempotent.
Completions are idempotent.
Critical uniqueness is enforced by the database.
Historical records are preserved where necessary.
Large collections are paginated.
Indexes follow real query patterns.
Sensitive data is protected.
Schema changes are deliberate.
```

The next implementation artifact is:

```text
backend/prisma/schema.prisma
```

but the Prisma schema must be generated from this data model rather than designed independently.
