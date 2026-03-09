# AI-Based Job and Internship Recommendation System

## 1. Updated Product Vision

This platform is for job seekers and internship seekers, with AI helping both candidates and companies make better decisions.

Main product promise:

1. Candidate uploads one or more resumes.
2. Candidate can see all job/internship postings except deleted ones.
3. Candidate has a separate Recommendation feature.
4. Candidate selects a resume and gets top 20 best-fit postings.
5. Candidate can apply and manage their applications.
6. Company can post openings, manage posting lifecycle, and manage applications.
7. Company can rank applicants by fit for each posting.

## 2. Role-Based Features

### Candidate

- Signup/login
- Upload/manage multiple resumes
- Browse all postings (active + disabled, except deleted)
- Clear status visibility on each posting
  - `Active - Accepting applications`
  - `Disabled - Not receiving applications`
- Separate "Recommendations" page
- Choose any one resume and get top 20 recommendations
- Apply to active postings
- Manage applications (withdraw, track status, view submitted resume)

### Company

- Signup/login
- Post job/internship
- Edit posting details
- Disable posting (still visible to candidates as not accepting)
- Re-enable posting
- Permanently delete posting
- View number of applications per posting
- Manage applications (shortlist/reject/update status)
- View and rank resumes by AI fit score per posting

### Admin (optional)

- Manage users/companies
- Platform moderation and analytics

## 3. Correct Posting Visibility Rules

This is the final behavior based on your requirement:

1. `active`
   - Visible in candidate listings
   - Visible in recommendations
   - Accepts applications
2. `disabled`
   - Visible in candidate listings
   - Badge shown: `Not receiving applications`
   - Apply button disabled
   - Not included in recommendation top 20 by default
3. `deleted`
   - Not visible to candidates
   - Not visible in recommendation results
   - Removed from company normal view (or kept in admin audit only)

## 4. End-to-End Flow

### 4.1 Candidate Flow

1. Candidate signs up/logs in.
2. Candidate uploads resumes to profile.
3. Candidate browses full listing page:
   - sees active and disabled postings
   - disabled postings show non-applicable status
4. Candidate opens Recommendation feature.
5. Candidate selects one resume from many resumes.
6. AI compares resume against all relevant postings and returns top 20 active best matches.
7. Candidate applies to selected active postings.
8. Candidate manages applications in "My Applications".

### 4.2 Company Flow

1. Company signs up/logs in.
2. Company posts a job/internship.
3. Company views posting dashboard with counts and statuses.
4. Company can disable/enable/delete posting.
5. Company opens applications for a posting.
6. AI ranks applicants by fit score.
7. Company manages applicants (shortlist/reject/progress stages).

## 5. Recommendation Feature (Separate Module)

This must be independent from normal browse.

Input:

- Selected resume
- Active postings universe

Output:

- Top 20 recommendations
- Match score and explanation

Why separate:

- Browse page is for exploring all listings
- Recommendation page is for fast shortlist from thousands of postings

## 6. AI Matching and Ranking Logic

### 6.1 Candidate-side Recommendation (Resume -> Top 20 Jobs)

Scoring dimensions:

1. Skill overlap
2. Semantic similarity (resume vs description)
3. Experience relevance
4. Education/certification relevance
5. Optional location/type preference

Example weighted score:

- `finalScore = 0.40*skill + 0.30*semantic + 0.15*experience + 0.10*education + 0.05*preference`

Then:

1. Score all active postings
2. Sort descending
3. Return top 20

### 6.2 Company-side Ranking (Posting -> Best Applicants)

Input:

- One posting
- All applications for that posting

Output:

- Ranked applicants list with:
  - fit score
  - matched skills
  - missing skills
  - short explanation

## 7. Data Model (Recommended)

Use Firestore as single source of truth.

### `users`

- `id`, `name`, `email`, `role`, `createdAt`, `status`

### `companies`

- `id`, `ownerUserId`, `companyName`, `industry`, `createdAt`

### `resumes`

- `id`, `userId`, `fileUrl`, `parsedText`, `skillsExtracted[]`, `createdAt`

### `postings`

- `id`, `companyId`, `type(job|internship)`, `title`, `description`, `requiredSkills[]`, `deadline`, `location`, `status(active|disabled|deleted)`, `createdAt`, `updatedAt`

### `applications`

- `id`, `postingId`, `companyId`, `candidateUserId`, `resumeId`, `appliedAt`, `status(submitted|reviewing|shortlisted|rejected|hired)`, `fitScore`

### `recommendation_cache` (optional)

- `id`, `candidateUserId`, `resumeId`, `postingId`, `score`, `explanation`, `generatedAt`

## 8. Management Features (Both Sides)

### Candidate application management

- View all submitted applications
- Filter by status/date/type
- Withdraw application (before deadline or based on policy)
- Track progress updates from company

### Company application management

- View all applications per posting
- Bulk actions (shortlist/reject)
- Move candidate through pipeline stages
- Download/open resume
- AI-ranked and manual sorting options

## 9. Critical Product Rules

1. Candidate can apply only once per posting with same resume.
2. Disabled posting must remain visible but non-applicable.
3. Deleted posting must be hidden from candidate experience.
4. Recommendation returns top 20 active postings only.
5. Company can manage only own postings and own applications.
6. Candidate can view/manage only own resumes and applications.

## 10. Implementation Solution for Your Current Codebase

1. Move all applications from localStorage to Firestore.
2. Standardize posting `status` logic in all listing and recommendation queries.
3. In candidate listing page, show disabled postings with status badge and disabled apply button.
4. Build dedicated Recommendations page with resume selector and top 20 result list.
5. Implement company-side application pipeline management.
6. Replace random recommendation with deterministic scoring engine.
7. Add role-based Firestore security rules.

## 11. Final Product Statement

This project is a two-sided AI recruitment platform where:

- candidates browse all opportunities, manage applications, and get top 20 resume-based recommendations,
- companies manage posting lifecycle (enable/disable/delete), manage incoming applications, and rank applicants by AI fit,
- disabled postings remain visible but clearly marked as not accepting applications.

## 12. Optional Advanced Feature (Detailed)

### Feature Name

Interview Probability Sandbox (Optional, High-Impact Module)

### Why this is optional

- Core platform works without this module.
- This module is an advanced intelligence layer for conversion improvement.
- It can be enabled after the recommendation engine is stable.

### Feature objective

Before applying, candidate can simulate interview probability for a specific posting using a selected resume, then get targeted improvements and a projected score increase.

### Where this feature appears

This is a separate module, connected to both candidate surfaces:

1. Recommendations page (top 20)
   - Quick Sandbox entry on each recommended card.
2. Browse/Job details page (all visible postings)
   - Manual Sandbox entry for any selected posting.

So the feature is not limited to top 20 recommendations.

### Detailed candidate flow

1. Candidate selects a resume version.
2. Candidate opens a posting (from recommendations or normal browse).
3. Candidate clicks `Run Interview Sandbox`.
4. System calculates current interview probability and fit breakdown.
5. System returns top improvement actions (ranked by expected impact).
6. Candidate can apply one or more actions.
7. System generates updated resume version preview.
8. System recomputes projected probability.
9. Candidate chooses:
   - Apply with original resume
   - Apply with optimized resume version

### Output shown to candidate

- Current fit score (0-100)
- Interview probability band (`Low`, `Medium`, `High`)
- Score breakdown by component
  - Skill match
  - Keyword coverage
  - Experience relevance
  - Project evidence quality
- Top 3 or Top 5 recommended edits
- Predicted uplift per edit (for example `+8%`)
- Final projected score after selected edits

### Posting status behavior inside Sandbox

1. `active`
   - Sandbox available
   - Apply enabled
2. `disabled`
   - Sandbox available
   - Apply blocked
   - Show label: `Not receiving applications`
3. `deleted`
   - Posting hidden from candidate
   - Sandbox not accessible

### Company-side value

Indirect but strong:

- Better quality applications
- Higher applicant relevance per posting
- Reduced screening noise
- Faster shortlist decisions

### Suggested scoring baseline for Sandbox MVP

`interviewProb = 0.40*skillMatch + 0.30*semanticMatch + 0.20*experienceMatch + 0.10*projectEvidence`

Counterfactual simulation examples:

- Add 2 missing required skills -> recompute
- Improve summary with JD keywords -> recompute
- Add quantified project bullets -> recompute

### Data additions (recommended)

Add optional collections/tables:

1. `sandbox_runs`
   - `id`, `candidateUserId`, `resumeId`, `postingId`, `baseScore`, `projectedScore`, `createdAt`
2. `sandbox_suggestions`
   - `runId`, `type`, `message`, `expectedUplift`, `applied`
3. `resume_versions`
   - `id`, `parentResumeId`, `candidateUserId`, `contentRef`, `createdFromRunId`, `createdAt`

### UX guardrails

1. Show disclaimer: `Probability is an estimate, not a guarantee.`
2. Limit run frequency per posting to avoid abuse.
3. Keep runtime fast (target under 2-3 seconds for MVP).
4. Keep language actionable, not generic.

### Rollout strategy

1. Phase A (internal/beta)
   - Read-only suggestions, no resume generation.
2. Phase B
   - Resume version generation + projected score.
3. Phase C
   - Learn from outcomes (shortlisted/rejected) to improve calibration.

### Success metrics for optional feature

- Increase in apply-to-shortlist conversion rate
- Percentage of users running Sandbox before apply
- Average predicted uplift accepted by candidates
- Reduction in low-fit applications for companies
