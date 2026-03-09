# AI Planner Project - Full Code-Based Analysis

This document explains the project based on actual source code, not README claims.

## 1. What this project is

This is a role-based recruitment web app built with React + Vite. It combines:

- A resume analyzer landing experience (simulated AI analysis on upload)
- Job seeker workflow (upload resumes, browse jobs, AI match jobs, apply)
- Company workflow (post jobs, manage listings, view applicants)
- Admin workflow (overview + management tables)
- Voice commands for job-seeker navigation/actions

Core idea: help candidates find relevant jobs and help companies shortlist candidates, with AI-themed UX and mock/simplified matching.

## 2. Tech stack and foundations

From `package.json` and source:

- Frontend: React 19, React Router
- Build tool: Vite
- UI: Tailwind CSS v4 + custom CSS system (`src/index.css`)
- Icons: `lucide-react`
- Backend services: Firebase Auth + Firestore
- HTTP client: Axios included but not actively used in core flow

Main app composition:

- `src/main.jsx` wraps app in `BrowserRouter`, `AuthProvider`, `VoiceProvider`
- `src/App.jsx` defines public routes and protected role routes

## 3. Route and role architecture

Routing is role-gated in `src/App.jsx`:

- Public:
  - `/` -> `AILanding`
  - `/login` -> `Login`
  - `/signup` -> `Signup`
- User-only (`user.role === "user"`):
  - `/user` -> `MyResumes`
  - `/user/jobs` -> `JobsList`
  - `/user/applied` -> `AppliedJobs`
  - `/user/matcher` -> `JobMatcher`
- Company-only (`user.role === "company"`):
  - `/company` -> `CompanyOverview`
  - `/company/post-job` -> `PostJob`
  - `/company/manage-jobs` -> `ManageJobs`
- Admin-only (`user.role === "admin"`):
  - `/admin` -> `AdminOverview`
  - `/admin/companies` -> `ManageCompanies`
  - `/admin/users` -> `ManageUsers`

If role check fails, route redirects to `/login`.

## 4. Authentication and session flow

### 4.1 Auth model used by UI

`src/context/AuthContext.jsx` stores the signed-in user object in localStorage:

- On app load: reads `localStorage.user`
- `login(userData)`: stores `{ uid, email, role }`
- `logout()`: removes localStorage key and clears state

This local user state controls route access.

### 4.2 Firebase sign-in and role detection

`src/pages/Login.jsx`:

1. Uses Firebase `signInWithEmailAndPassword`
2. Checks Firestore:
   - First `users/{uid}`
   - If not found, checks `companies/{uid}`
   - If still not found, defaults role to `user`
3. Saves role into AuthContext (localStorage-backed)
4. Navigates by role to `/user`, `/company`, or `/admin`

### 4.3 Signup behavior

`src/pages/Signup.jsx`:

- Creates Firebase auth account
- If role is `user`, writes profile to `users/{uid}`
- If role is `company`, writes profile to `companies/{uid}`
- Then redirects to login

No signup option for admin in UI. Admin role must be manually created in Firestore `users` with role `admin`.

## 5. Data storage architecture (important)

This project uses a hybrid data pattern:

- Firestore for:
  - users
  - companies
  - resumes
  - jobs
- localStorage for:
  - applications
  - some admin fallback/mock stats
  - mock jobs fallback in utility function

Main utility: `src/utils/storage.js`.

This hybrid design is the biggest structural characteristic and source of inconsistencies.

## 6. End-to-end user journey

### 6.1 Landing (`/`)

`src/pages/AILanding.jsx`:

- Allows drag/drop resume file (PDF/DOCX)
- Clicking "Analyze" runs simulated AI with timeout (not backend AI)
- Displays generated analysis in `AnalysisResult` component

This page is marketing/demo style and independent of login.

### 6.2 User sign-up/login

- User creates account -> Firestore `users`
- User logs in -> role resolved -> `/user`

### 6.3 My Resumes (`/user`)

`src/pages/user/MyResumes.jsx`:

- Upload resumes via file input
- Converts file to base64 and stores in Firestore `resumes`
- Reads current user resumes from Firestore
- Can delete resume documents
- Can open resume in new tab from stored base64

### 6.4 Browse Jobs (`/user/jobs`)

`src/pages/user/JobsList.jsx`:

- Reads active jobs from Firestore `jobs`
- Client-side filters by title/company/skills
- Shows "Apply" button visually, but this page does not persist applications

### 6.5 AI Matcher (`/user/matcher`)

`src/pages/user/JobMatcher.jsx`:

- Loads resumes from Firestore for current user
- User selects a resume and clicks "Find Matches"
- Simulated progress states shown
- Calls `getAiJobMatches(resumeName, userId)` from `storage.js`
- Matching currently does:
  - fetches active Firestore jobs
  - excludes jobs already applied (from localStorage applications)
  - randomizes and returns top 10
- User can apply from matcher:
  - `applyForJob(jobId, resumeName, userId)` writes to localStorage `applications`

### 6.6 Applied Jobs (`/user/applied`)

`src/pages/user/AppliedJobs.jsx`:

- Reads applications from localStorage
- Reads jobs from Firestore to map titles/companies
- Shows user's submitted applications list

## 7. End-to-end company journey

### 7.1 Company overview (`/company`)

`src/pages/company/CompanyOverview.jsx`:

- Loads jobs from Firestore where `companyId === currentUser.uid`
- Loads all applications from localStorage and filters by company's job IDs
- Shows stats and recent applications

### 7.2 Post job (`/company/post-job`)

`src/pages/company/PostJob.jsx`:

- Form fields: title, company, skills, description, deadline
- Creates Firestore document in `jobs` with `companyId`, `active: true`

### 7.3 Manage jobs (`/company/manage-jobs`)

`src/pages/company/ManageJobs.jsx`:

- Lists current company's jobs from Firestore
- Loads applications from localStorage and maps by job ID
- Can archive job by setting Firestore `active: false`
- Candidate view shows application rows and mock compatibility scores

## 8. End-to-end admin journey

### 8.1 Admin overview (`/admin`)

`src/pages/admin/AdminOverview.jsx`:

- Uses utility data (`getJobs`, `getUserResumes`) for stats
- Many activity entries are static UI placeholders

### 8.2 Manage companies/users

- `src/pages/admin/ManageCompanies.jsx` uses hardcoded sample array
- `src/pages/admin/ManageUsers.jsx` uses hardcoded sample array

Admin management is mostly UI prototype, not live Firestore management yet.

## 9. Voice command subsystem

Files:

- `src/context/VoiceContext.jsx`
- `src/services/voiceService.js`

How it works:

- Uses Web Speech API (`SpeechRecognition`/`webkitSpeechRecognition`)
- Recognizes command text and maps to predefined actions:
  - Navigate (`/user/jobs`, `/user/matcher`, etc.)
  - Click selectors (`[data-apply]`, submit buttons, etc.)
  - Logout/help
- Access restriction: only runs for `user` role in `VoiceContext`
- TTS feedback via `speechSynthesis`

Notes:

- Command map includes company/admin navigation phrases, but non-user roles are blocked by role check.
- Some click selectors depend on attributes that are not consistently present across components.

## 10. UI and layout system

- Shared side navigation in `src/components/layout/Sidebar.jsx`
- Role-specific layouts:
  - `src/layouts/UserLayout.jsx`
  - `src/layouts/CompanyLayout.jsx`
  - `src/layouts/AdminLayout.jsx`
- Custom design tokens and components in `src/index.css`

Design style is modern SaaS-like with glass cards, badges, and gradients.

## 11. Real project purpose (from code behavior)

This repository appears to be a functional prototype / MVP for an AI-assisted hiring platform, especially focused on:

- Resume-based candidate workflows
- Company posting and candidate visibility
- Role-based portal UX
- AI-themed interactions (mostly simulated, not full ML backend)

It is best described as:

"Frontend-heavy recruitment MVP with Firebase auth/data basics + local mock logic for parts of hiring workflow."

## 12. Key problems (PS) and practical solutions

### PS1: Mixed data sources (Firestore + localStorage)

Problem:

- Applications stored in localStorage, while jobs/resumes/users are in Firestore.
- Data is device/browser specific for applications and not shared globally.

Solution:

- Create Firestore `applications` collection with schema:
  - `jobId`, `userId`, `resumeId`, `resumeName`, `companyId`, `dateApplied`, `status`
- Replace `getApplications/applyForJob` to use Firestore reads/writes.
- Keep localStorage only for temporary UI state (if needed).

### PS2: Route protection relies on localStorage user object

Problem:

- AuthContext does not subscribe to Firebase auth state listener.
- If localStorage is stale/manual-edited, route gating can desync from Firebase session.

Solution:

- Use `onAuthStateChanged(auth, ...)` in AuthContext.
- On auth state change, load role from Firestore and set in context.
- Use loading guard while auth state initializes.

### PS3: Potential null access on `auth.currentUser`

Problem:

- Multiple pages directly access `auth.currentUser.uid` inside effects.
- On refresh timing, this can be null temporarily and crash.

Solution:

- Guard every data load with `if (!auth.currentUser) return;`
- Better: rely on centralized auth context user uid.

### PS4: Jobs list "Apply" button does not persist application

Problem:

- In `JobsList`, apply button has no action wired to data layer.

Solution:

- Reuse shared apply handler service and store application in Firestore `applications`.
- Optionally require resume selection before apply.

### PS5: Admin panel mostly static/mock

Problem:

- `ManageUsers` and `ManageCompanies` are hardcoded arrays.

Solution:

- Query Firestore `users` and `companies` collections.
- Add status actions (suspend/verify) backed by Firestore fields.

### PS6: Security and configuration hygiene

Problem:

- Firebase keys are directly in source. This is common client-side, but rules are critical.

Solution:

- Ensure strict Firestore rules by role and ownership.
- Move config values to `.env` + `import.meta.env` for maintainability.

### PS7: Legacy/unused files present

Problem:

- `src/pages/UserDashboard.jsx`, `src/pages/CompanyDashboard.jsx`, `src/pages/AdminDashboard.jsx` are not used in router.

Solution:

- Remove dead pages or explicitly route/use them.
- Keeping dead files can confuse future maintainers.

## 13. Data model snapshot from code

Likely collections and fields:

- `users/{uid}`: `{ name, email, role, createdAt }`
- `companies/{uid}`: `{ userId, name, email, role: "company", createdAt }`
- `jobs/{jobId}`: `{ title, company, skills, description, deadline, companyId, active, createdAt }`
- `resumes/{resumeId}`: `{ userId, fileName, base64Data, uploadedAt }`
- localStorage `applications[]`: `{ id, jobId, resumeName, userId, dateApplied }`

## 14. What is real AI vs simulated AI

Real:

- Firebase-backed data retrieval
- Role-aware navigation and filtered queries

Simulated:

- Landing page resume analysis score/details
- Job matcher scoring logic (randomized ordering)
- Candidate compatibility percentage in company view

If true AI is required, this app needs a backend inference layer (e.g., embeddings/NLP ranking API).

## 15. How to think about this code if you continue it

Treat current repo as a strong UI prototype with partial backend integration.

Recommended implementation order:

1. Unify data in Firestore (especially applications)
2. Refactor auth/session handling to Firebase auth listener
3. Add robust Firestore security rules
4. Convert admin pages from static to live queries
5. Replace simulated matching with deterministic/scored algorithm
6. Remove legacy unused files and stabilize routes

## 16. Quick project classification

- Type: Full-stack-lite web app (frontend-dominant)
- Domain: Recruitment / resume intelligence
- Maturity: MVP prototype with production-like UI but mixed data maturity
- Best use now: Demo + foundation for real product development

---

If you want, this can be turned into a production-ready version by implementing the fixes in Section 12 in sequence.
