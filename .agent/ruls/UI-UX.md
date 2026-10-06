# OFFSCRIPT — UI/UX DESIGN SYSTEM & EXPERIENCE

## 1. Document Purpose

This document defines the visual language, user experience rules, interaction patterns, responsive behavior, accessibility requirements, component standards, and page-level UI specifications for OFFSCRIPT.

It is the UI/UX source of truth.

The implementation must follow:

```text
FEATURES.md
     ↓
UI-UX.md
     ↓
Components
     ↓
Pages
```

The UI must represent real product behavior.

The UI must never create fake functionality, fake progress, fake points, fake achievements, or fake states.

---

# 2. Product Design Direction

OFFSCRIPT should feel:

* Technical
* Premium
* Competitive
* Modern
* Focused
* Structured
* Dark
* Red-accented
* Developer-oriented

The visual identity should communicate:

```text
Technical Education
+
Engineering
+
Competition
+
Achievement
+
Professional Identity
```

The interface should feel closer to a modern developer platform than a traditional educational website.

---

# 3. Core Design Principles

## 3.1 Clarity Over Decoration

Every visual element must have a purpose.

Avoid:

* unnecessary decoration
* excessive gradients
* excessive glow
* excessive glassmorphism
* giant rounded containers
* visual noise
* decorative animations with no UX purpose

---

## 3.2 Technical Premium

The interface should use:

* strong typography
* precise spacing
* structured layouts
* subtle borders
* dark surfaces
* controlled red accents
* technical metadata
* clear hierarchy

The design should feel engineered rather than decorative.

---

## 3.3 Competitive Without Being Childish

OFFSCRIPT uses gamification through:

* points
* badges
* progress
* achievements
* competitions
* milestones

But it must avoid:

* cartoon-style interfaces
* excessive emojis
* childish illustrations
* casino-like reward effects
* excessive confetti
* oversized reward animations

---

## 3.4 Progressive Disclosure

Do not display everything at once.

Show:

```text
Primary information
        ↓
Important action
        ↓
Supporting information
        ↓
Advanced details
```

---

# 4. Color System

## 4.1 Background Colors

| Token                  | Value     | Usage                        |
| ---------------------- | --------- | ---------------------------- |
| `background-primary`   | `#080808` | Main application background  |
| `background-secondary` | `#0D0D0D` | Secondary sections           |
| `surface`              | `#121212` | Main surfaces                |
| `surface-card`         | `#171717` | Cards                        |
| `surface-elevated`     | `#1C1C1C` | Modals/dropdowns/elevated UI |

---

## 4.2 Border Colors

```text
border-default: #292929
```

Borders should remain subtle.

Avoid excessive outlines.

---

## 4.3 Text Colors

```text
text-primary:   #F5F5F5
text-secondary: #A1A1A1
text-muted:     #6B6B6B
```

Use primary text for:

* titles
* important values
* active navigation

Use secondary text for:

* descriptions
* metadata
* supporting information

Use muted text only for:

* timestamps
* secondary metadata
* disabled information

---

## 4.4 Accent Colors

```text
primary-red: #E50914
bright-red:  #FF1E2D
dark-red:    #8B0000
```

Primary red is used for:

* primary CTA
* active navigation
* progress
* important actions
* selected states
* achievement emphasis

Bright red should be used sparingly.

Dark red can be used for:

* subtle backgrounds
* status accents
* depth

---

# 5. Color Usage Rules

Red must be an accent, not the entire interface.

Do not:

```text
Make every button red
Make every border red
Make every card red
Use red everywhere
```

Use red to guide attention.

Recommended hierarchy:

```text
Black / dark surfaces
        ↓
White typography
        ↓
Gray supporting information
        ↓
Red interaction / achievement
```

---

# 6. Typography

Typography must be modern, technical, and highly readable.

Recommended hierarchy:

```text
Display
H1
H2
H3
Body
Small
Metadata
```

---

## 6.1 Headings

Headings should be:

* bold
* compact
* high contrast
* clearly hierarchical

Avoid overly decorative fonts.

---

## 6.2 Body Text

Body text must prioritize readability.

Use:

* comfortable line-height
* moderate font size
* sufficient contrast

Do not use tiny body text.

---

## 6.3 Technical Text

Technical metadata may use a monospace font where appropriate.

Examples:

```text
API
REST
JWT
v1.0.4
AUTH-014
```

Do not use monospace for entire pages.

---

# 7. Spacing System

Use a consistent spacing scale.

Recommended base:

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
```

Prefer consistent spacing tokens over arbitrary values.

---

# 8. Border Radius

OFFSCRIPT should use controlled radius.

Recommended:

```text
Small controls: 6px
Inputs:         8px
Cards:          10px
Large surfaces: 12px
Modal:          12px
```

Avoid:

```text
Huge pill-shaped cards
Excessive rounded corners
```

Pills may be used for:

* status badges
* compact tags
* filters

---

# 9. Shadows and Elevation

Use shadows carefully.

Dark interfaces should primarily communicate elevation through:

* surface color
* border
* subtle shadow

Avoid heavy glowing shadows.

---

# 10. Layout System

Desktop content should use a centered responsive container.

Recommended structure:

```text
┌──────────────────────────────────────────────┐
│ NAVBAR                                       │
├──────────────────────────────────────────────┤
│                                              │
│              MAIN CONTENT                    │
│                                              │
│                                              │
└──────────────────────────────────────────────┘
```

Content should not touch the screen edges on desktop.

---

# 11. Responsive Breakpoints

The implementation should support:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Suggested Tailwind breakpoints:

```text
sm
md
lg
xl
2xl
```

Do not design only for desktop and shrink it afterward.

Mobile must be considered from the beginning.

---

# 12. Global Navbar

## Guest Navbar

```text
OFFSCRIPT

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

## Authenticated Navbar

```text
OFFSCRIPT

Home
Roadmap
Competitions
Projects
Badges
Dashboard

Profile ▾
```

---

## Profile Dropdown

```text
My Dashboard
My Profile
My Badges
My Points
────────────
Logout
```

Logout must be visually separated from normal navigation.

---

# 13. Mobile Navigation

On mobile:

```text
OFFSCRIPT
        ☰
```

Opening navigation should provide access to:

```text
Home
Roadmap
Competitions
Projects
Badges
Dashboard
Profile
Logout
```

The menu must:

* be keyboard accessible
* trap focus appropriately when modal-like
* close after navigation
* close when explicitly requested
* not cause horizontal overflow

---

# 14. Page Header

Standard internal pages should use a consistent header:

```text
Page Title
Short description

Optional:
Breadcrumb
Status
Primary action
```

Example:

```text
Projects
Build practical technical experience.

[Create / View Project]
```

---

# 15. Buttons

Buttons must have clear hierarchy.

## Primary

Used for the main action.

Example:

```text
Continue Learning
Submit Assignment
Register
Save Changes
```

---

## Secondary

Used for supporting actions.

Example:

```text
View Details
Edit
Cancel
```

---

## Destructive

Used for:

```text
Delete
Remove
Logout where appropriate
```

Destructive actions must require appropriate confirmation when consequences are significant.

---

# 16. Button States

Every interactive button should support:

```text
Default
Hover
Focus
Active
Disabled
Loading
Success
Error
```

Example:

```text
Submit Assignment
        ↓
Submitting...
        ↓
Submitted
```

Do not allow repeated submissions while the request is pending.

---

# 17. Inputs

Inputs must include:

```text
Label
Input
Optional helper text
Validation
Error
```

Example:

```text
Username
[________________]

Choose a unique username.

Error:
Username is already taken.
```

Never rely on placeholder text as the only label.

---

# 18. Forms

Forms must provide:

```text
Clear labels
Logical grouping
Validation
Error messages
Loading state
Success state
Disabled state
```

Long forms should be divided into meaningful sections.

---

# 19. Cards

Cards should group related information.

Good card:

```text
┌──────────────────────────┐
│ PROJECT                  │
│ API Security Platform   │
│                          │
│ Intermediate             │
│ Next.js · Node.js        │
│                          │
│ Progress        65%      │
│ ███████████░░░           │
│                          │
│ View Project             │
└──────────────────────────┘
```

Avoid placing unrelated information inside the same card.

---

# 20. Status Components

Statuses should communicate through:

```text
Text
Icon where useful
Color
```

Examples:

```text
COMPLETED
CURRENT
AVAILABLE
LOCKED

ACTIVE
UPCOMING
COMPLETED
CANCELLED
```

Do not use color alone.

---

# 21. Progress Indicators

Progress must visually communicate actual backend data.

Possible patterns:

```text
78%
██████████████░░░░
```

or:

```text
Semester 01
78%
```

Progress bars must not imply precision beyond the actual data.

---

# 22. Dashboard UX

The Dashboard is the primary member workspace.

Recommended hierarchy:

```text
WELCOME BACK, USER

Keep building.
Keep breaking.

┌──────────────┐
│ POINTS       │
│ 1,240        │
└──────────────┘

┌─────────────────────────────┐
│ SEMESTER 01                 │
│ 78%                         │
│ █████████████░░░            │
└─────────────────────────────┘

CURRENT LEARNING

Week 14
API Authentication Testing

[Continue Learning]

RECENT ACTIVITY

...
```

---

# 23. Dashboard Priority

The dashboard must answer quickly:

```text
Where am I?
What am I learning?
What should I do next?
How much progress have I made?
What have I achieved?
```

Do not overload the dashboard with every possible statistic.

---

# 24. Roadmap UX

The Roadmap should use a vertical timeline.

Example:

```text
Semester 01

● Week 01
│
● Week 02
│
● Week 03
│
◉ Week 14  ← CURRENT
│
○ Week 15
│
🔒 Week 16
```

Recommended states:

```text
Completed
Current
Available
Locked
```

Current item must be visually dominant.

---

# 25. Roadmap Interaction

Clicking a roadmap item should:

* open its details when accessible
* show why it is locked when locked
* show completion state
* show relevant sessions

A locked item must not pretend to be accessible.

---

# 26. Session Page

Recommended structure:

```text
WEEK 14

API AUTHENTICATION TESTING

Progress
85%

OBJECTIVES
• ...
• ...
• ...

MATERIALS
• ...
• ...

ASSIGNMENT
...

[Complete Session]
```

---

# 27. Session Reading Experience

Technical content should prioritize readability.

Use:

* clear headings
* short sections
* code blocks
* lists
* diagrams where useful
* examples

Avoid excessive visual decoration.

---

# 28. Assignment List

Assignment cards/list items should expose:

```text
Title
Session
Status
Deadline
Difficulty
Reward
Action
```

Example:

```text
API Authentication Testing

Week 14
UNDER REVIEW

Deadline:
Sep 30, 2026

+50 Points

[View Assignment]
```

---

# 29. Assignment Details

Recommended hierarchy:

```text
Title
Status
Deadline

Description

Requirements

Submission

Evaluation

Reward
```

Primary action should depend on state.

Examples:

```text
Start Assignment
Continue
Submit Assignment
View Submission
Resubmit
```

The backend determines whether the action is valid.

---

# 30. Project List

Projects should provide strong technical scanning.

Display:

```text
Project Name
Difficulty
Technologies
Progress
Status
Reward
```

Example:

```text
SECURITY DASHBOARD

Intermediate

Next.js
Node.js
MongoDB

Progress: 65%

IN PROGRESS

[View Project]
```

---

# 31. Project Details

Recommended sections:

```text
Project Header
Overview
Requirements
Technologies
Milestones
Submission
Evaluation
Reward
```

Primary action depends on project state.

---

# 32. Competition List

Competition cards should immediately communicate:

```text
Competition
State
Date
Eligibility
Reward
Action
```

Example:

```text
OFFSCRIPT SECURITY CHALLENGE

REGISTRATION OPEN

Sep 28 → Oct 05

+500 Points

[Register]
```

---

# 33. Competition Details

Recommended structure:

```text
Competition Header

Status
Dates
Registration

Overview

Rules

Timeline

Eligibility

Submission

Evaluation

Rewards

[Register]
```

The primary action must reflect the current competition state.

Examples:

```text
Register
Registered
Competition Active
Submit
Submission Closed
Completed
```

---

# 34. Competition Timeline

Use a clear timeline:

```text
Registration
    ↓
Challenge Opens
    ↓
Submission Deadline
    ↓
Evaluation
    ↓
Results
```

Dates must come from backend data.

---

# 35. Badges Page

Badges should have a premium collectible feel.

Recommended layout:

```text
BADGES

Earned
Locked

┌───────┐
│  ◉    │
│       │
│ API   │
│ TEST  │
└───────┘
```

Avoid cartoonish trophy designs.

---

# 36. Badge States

## Earned

Show:

* badge
* name
* description
* earned date
* requirement

## Locked

Show:

* badge identity
* requirement
* locked visual treatment

Do not reveal sensitive internal logic unnecessarily.

---

# 37. Badge Details

Recommended:

```text
Badge Icon

BADGE NAME

Description

Requirement

Earned:
September 27, 2026
```

For locked badges:

```text
LOCKED

Requirement:
Complete Week 14
```

---

# 38. My Points Page

Recommended structure:

```text
MY POINTS

1,240
OFFSCRIPT POINTS

RECENT ACTIVITY

+50   Completed Week 14
+100  Project 2
+75   Competition
+25   Assignment
```

Include transaction metadata where useful.

---

# 39. Points Visual Hierarchy

The current balance should be prominent.

Transaction history should remain secondary.

Do not turn the page into a financial-dashboard clone.

---

# 40. Profile Page

Recommended layout:

```text
┌─────────────────────────────────────┐
│ Avatar                              │
│ Username                            │
│ Full Name                           │
│ Bio                                 │
│                                     │
│ 1,240 Points   78% Progress         │
└─────────────────────────────────────┘

BADGES

PROJECTS

COMPETITIONS

ACTIVITY
```

---

# 41. Edit Profile

Use grouped sections:

```text
Profile Information
Account Information
Avatar
Bio
```

Primary action:

```text
Save Changes
```

Show:

```text
Saving...
Saved
Error
```

---

# 42. Login Page

Login should be minimal and focused.

Recommended:

```text
OFFSCRIPT

Welcome back.

Email / Username
[____________]

Password
[____________]

[Login]

Forgot Password?

Don't have an account?
Register
```

Avoid unnecessary distractions.

---

# 43. Register Page

Recommended:

```text
Create your OFFSCRIPT account.

Username
Email
Password
Confirm Password

[Create Account]

Already have an account?
Login
```

Validation must be clear and immediate without becoming noisy.

---

# 44. Forgot Password

Recommended:

```text
Reset your password.

Email
[____________]

[Send Reset Link]

Back to Login
```

Do not expose whether an account exists if doing so would create account enumeration risk.

---

# 45. Logout Confirmation

If confirmation is used:

```text
Log out?

You will need to sign in again to access your member account.

[Logout]
[Cancel]
```

If the product uses immediate logout instead, the action must still safely clear authentication state.

---

# 46. Modals

Use modals for:

* confirmation
* focused forms
* important contextual actions

Do not use modals for every interaction.

Modal requirements:

```text
Clear title
Description
Primary action
Secondary action
Close control
Keyboard support
Focus management
```

---

# 47. Toasts

Use toasts for lightweight feedback.

Examples:

```text
Profile updated.
Assignment submitted.
Badge unlocked.
Points awarded.
```

Do not use toasts as the only way to communicate critical errors.

---

# 48. Error Pages

The application should have clear error states.

Examples:

```text
404
Page not found.

403
You do not have permission to access this resource.

500
Something went wrong.
```

Provide useful navigation.

---

# 49. Loading UX

Loading states must preserve layout where possible.

Prefer:

```text
Skeleton
```

for content-heavy pages.

Use spinners for:

```text
Button submission
Short operations
Small localized requests
```

Avoid full-page spinners for every API request.

---

# 50. Empty State UX

Empty states should explain:

```text
What is empty?
Why?
What can the user do next?
```

Example:

```text
No projects yet.

Your projects will appear here once they become available.

[Explore Roadmap]
```

---

# 51. Error UX

Error messages should be:

* specific
* concise
* actionable
* human-readable

Bad:

```text
Error 500
```

Better:

```text
We couldn't load your projects.
Please try again.
```

Technical details belong in logs, not user-facing messages.

---

# 52. Accessibility

The application must support:

* keyboard navigation
* visible focus
* semantic HTML
* accessible labels
* accessible buttons
* accessible form errors
* sufficient contrast
* screen reader compatibility

Interactive elements must have meaningful accessible names.

---

# 53. Keyboard Navigation

Users must be able to navigate:

```text
Navbar
Menus
Buttons
Forms
Cards
Modals
Dialogs
Tabs
```

using the keyboard.

Focus must remain visible.

---

# 54. Motion Design

Use animation to communicate:

* state changes
* transitions
* hierarchy
* feedback

Do not animate everything.

Recommended:

```text
Subtle page transitions
Small hover transitions
Progress animation
Modal entrance
Dropdown entrance
Badge unlock feedback
```

Avoid:

```text
Constant motion
Large bouncing elements
Long loading animations
Excessive parallax
```

---

# 55. Framer Motion Rules

Framer Motion may be used for:

* page transitions
* cards
* modal transitions
* navigation
* progress
* achievement feedback

Animations must remain:

* fast
* subtle
* purposeful

Respect reduced-motion preferences.

---

# 56. Icons

Use Lucide React.

Icons should:

* communicate meaning
* support text
* maintain consistency

Do not replace important text with icons only.

Examples:

```text
Edit
Delete
Lock
Check
Arrow
Calendar
Clock
Trophy
```

---

# 57. Tables

Use tables when structured comparison is more readable than cards.

Tables must:

* remain readable on mobile
* avoid unnecessary columns
* support horizontal scrolling only when genuinely necessary
* preserve important actions

---

# 58. Mobile Cards

On mobile, cards may become full-width blocks.

Do not simply shrink desktop cards.

Reorder content based on priority.

Example:

```text
Title
Status
Primary action
Important metadata
Secondary metadata
```

---

# 59. Mobile Forms

Forms should:

* use full available width
* maintain comfortable touch targets
* avoid tiny controls
* clearly show errors
* keep primary action visible

---

# 60. Touch Targets

Interactive controls should have sufficiently large touch targets.

Avoid tiny:

```text
buttons
icons
close controls
dropdown triggers
```

especially on mobile.

---

# 61. Data Freshness

When a user performs an action:

```text
Submit
Complete
Register
Save
```

the UI should reflect the confirmed backend response.

Use TanStack Query invalidation/refetching where appropriate.

Do not manually fake updated values when the backend response is authoritative.

---

# 62. Optimistic UI

Optimistic updates may be used only where safe.

Avoid optimistic updates for sensitive operations such as:

* points
* badges
* competition registration
* permissions
* authentication
* irreversible actions

For these, prefer confirmed server responses.

---

# 63. UX for Duplicate Actions

When an action is processing:

```text
Button disabled
+
Loading state
```

Example:

```text
[Submitting...]
```

After success:

```text
[Submitted]
```

This prevents accidental duplicate actions.

---

# 64. Security-Aware UX

The UI must never expose sensitive implementation details.

Do not display:

* JWT tokens
* passwords
* internal database IDs unless necessary
* stack traces
* server paths
* secrets

---

# 65. Authenticated vs Guest UI

The interface must immediately reflect authentication state.

Guest:

```text
Login
Register
```

Authenticated:

```text
Dashboard
Profile
Logout
```

After logout, private navigation must disappear.

---

# 66. Protected Route UX

When a guest attempts to access a protected page:

```text
Protected Page
      ↓
Authentication Check
      ↓
Not authenticated
      ↓
Redirect to Login
```

Where useful, preserve the intended destination so the user can continue after login.

---

# 67. Browser Back After Logout

After logout:

```text
Logout
 ↓
Clear auth state
 ↓
Clear private cache
 ↓
Redirect
 ↓
Back
 ↓
Protected route re-checks auth
 ↓
Access denied / redirect
```

Previously rendered private content must not become usable again.

---

# 68. Content Density

OFFSCRIPT is a technical platform.

Desktop pages may use moderately high information density.

However:

```text
Density ≠ Clutter
```

Use whitespace and hierarchy to separate information.

---

# 69. Visual Hierarchy

Every page should clearly identify:

```text
1. Page purpose
2. Current state
3. Primary action
4. Important information
5. Secondary information
```

If everything looks equally important, the page has failed its hierarchy.

---

# 70. Design Anti-Patterns

Avoid:

```text
❌ Excessive gradients
❌ Neon everywhere
❌ Excessive glow
❌ Giant rounded cards
❌ Excessive glassmorphism
❌ Childish gamification
❌ Too many animations
❌ Tiny text
❌ Low contrast
❌ Red everywhere
❌ Fake data
❌ Dead buttons
❌ Hidden primary actions
❌ Desktop-only layouts
```

---

# 71. Component Architecture

Reusable UI components should be preferred.

Recommended structure:

```text
components/
├── ui/
│   ├── Button
│   ├── Input
│   ├── Modal
│   ├── Badge
│   ├── Card
│   ├── Progress
│   ├── Tabs
│   ├── Dropdown
│   ├── Skeleton
│   └── Toast
│
├── layout/
│   ├── Navbar
│   ├── MobileNav
│   ├── PageHeader
│   └── Footer
│
├── dashboard/
├── roadmap/
├── sessions/
├── assignments/
├── projects/
├── competitions/
├── badges/
└── profile/
```

---

# 72. Component Rules

Components should be:

* reusable
* composable
* accessible
* predictable
* data-driven

Avoid creating a new component for every tiny visual variation.

Avoid giant components containing entire pages and all business logic.

---

# 73. Page Architecture

Recommended page responsibility:

```text
Page
 ↓
Feature components
 ↓
Hooks
 ↓
API layer
 ↓
Backend
```

Pages should not contain large amounts of business logic.

---

# 74. State Architecture

Separate:

```text
Server State
Client UI State
Form State
Authentication State
```

Recommended:

```text
TanStack Query → server state
React state → local UI state
React Hook Form → form state
Auth provider/context → authenticated user state
```

---

# 75. Responsive Quality Checklist

Every page must be tested at:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Check:

```text
[ ] No horizontal overflow
[ ] Navbar works
[ ] Buttons accessible
[ ] Forms usable
[ ] Cards readable
[ ] Typography scales
[ ] Images fit
[ ] Modals fit
[ ] Tables remain usable
[ ] Primary actions remain visible
```

---

# 76. Visual Quality Checklist

Before considering a page complete:

```text
[ ] Correct dark background
[ ] Correct surface hierarchy
[ ] Correct red accent usage
[ ] Typography hierarchy
[ ] Consistent spacing
[ ] Consistent radius
[ ] Correct borders
[ ] Clear primary action
[ ] Good information hierarchy
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] Success state
[ ] Hover state
[ ] Focus state
[ ] Disabled state
[ ] Mobile layout
```

---

# 77. Stitch AI Design Direction

When generating UI concepts with Stitch AI, the prompt should communicate:

```text
OFFSCRIPT
Technical learning and competition platform
Dark premium interface
Black and red visual identity
Developer-focused
Professional
Competitive
Clean
High information clarity
Modern dashboard
Subtle motion
Minimal glassmorphism
No childish gamification
No excessive neon
No excessive gradients
No oversized rounded cards
Responsive desktop/mobile
```

The generated design must be treated as visual inspiration and translated into the OFFSCRIPT component system.

Stitch output must not override:

```text
FEATURES.md
API.md
AUTH.md
TECH-STACK.md
```

---

# 78. Design-to-Code Rule

Before implementing a page:

```text
Design
 ↓
Identify reusable components
 ↓
Identify states
 ↓
Identify data requirements
 ↓
Identify interactions
 ↓
Implement
 ↓
Connect real API
 ↓
Test responsive behavior
```

Do not build isolated screenshots.

Build reusable product interfaces.

---

# 79. UX Source of Truth

When UI decisions conflict:

```text
Business behavior → FEATURES.md
API contract      → API.md
Authentication    → AUTH.md
Technology        → TECH-STACK.md
Visual behavior   → UI-UX.md
```

Business logic always takes precedence over visual assumptions.

---

# 80. Final UI/UX Contract

OFFSCRIPT UI must satisfy:

```text
Dark
+
Red
+
Technical
+
Premium
+
Clear
+
Responsive
+
Accessible
+
Data-driven
+
Consistent
+
Purposeful
```

The final interface should make users understand:

```text
Where am I?
What am I doing?
What have I completed?
What can I do next?
What have I earned?
What should I focus on?
```

The design should support the product's learning and competition systems rather than distract from them.

---

# 81. Final Implementation Principle

The UI is not considered complete because it looks good.

A page is complete when:

```text
Real Data
+
Correct Business Logic
+
Correct Permissions
+
Correct Interaction
+
Responsive UI
+
Accessible UI
+
All Required States
+
Tests
=
Complete Feature
```

The goal is not to build a beautiful prototype.

The goal is to build a coherent, production-ready OFFSCRIPT product.
