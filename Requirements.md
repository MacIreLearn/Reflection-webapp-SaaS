# Web Journal App — MVP Requirements (Mobile Compatible)

## 🎯 Objective
Create a Web Journal App that is mobile compatible, allowing users to reflect daily, track wellbeing, and optionally share entries with others. The experience must be fast, calming, and usable in under 3 minutes.

---

## 🏗️ 1. Architecture Design

The architecture follows a modern, mobile-first web approach:

- **Frontend (Next.js 14 + Tailwind):** A responsive, mobile-first web app with a calm, minimal interface optimized for quick daily entries. Statically generated pages for performance and SEO.
- **Backend (Node.js + Next.js API Routes):** Lightweight API routes for journal CRUD, sharing, reminders, and insights.
- **Database (PostgreSQL + Prisma):** Stores journal entries, user profiles, mood/wellness data, and sharing metadata.
- **Authentication (Supabase OAuth):** Email & password signup/login with password reset and cross-device sync.
- **Email (Resend API):** Daily reminder emails, sharing notifications, and account-related transactional emails.
- **Payments (Stripe):** Premium tier checkout for advanced features (AI insights, export, templates) via Stripe Checkout.
- **Cloud Storage:** Images, shared entry pages, and exported files.

---

## ✨ 2. Feature Design

### Core Features to Build:

1. **Authentication & User Accounts:**
   - Email & password signup/login with password reset via **Supabase OAuth**.
   - **Profile Settings:** Name, time zone, reminder time, and privacy preferences.
   - Account syncs across devices using timezone for reminders & streaks.
   - **Logout:** Provide a logout button in the header that signs the user out and redirects to the home page. The header should dynamically show "Sign In" or "Logout" based on the user's authentication state.

2. **Daily Journal Entry:**
   - **Auto-filled:** Date & time.
   - **Wellness Tracking:** Mood (1–10 slider), Energy (1–10), Stress (1–10).
   - **Reflection Prompts:** One thing I'm grateful for, today's main focus, wins today, challenges today, what I learned.
   - **Optional:** Custom tags, photo attachment (Phase 2: audio).
   - **Experience:** "Start Today's Entry" button, auto-save drafts, edit anytime, save confirmation, offline entry with auto-sync when online.
   - Entry creation must complete in under 3 minutes.

3. **Timeline & Calendar View:**
   - Timeline view (latest first) and calendar view with marked entries.
   - Tap any date to open that entry.

4. **Sharing Entries (Key Feature):**
   - **Private** (default): Entries are only visible to the author.
   - **Share via Secure Link:** Generates a view-only web page with option to disable later.
   - **Share with Specific Users** (Phase 2).
   - **Shared Entry Page:** Shows entry content, date, optional mood summary, and author name (optional toggle).
   - Link works without login; user can revoke access anytime; shared entry cannot be edited by viewer.

5. **Search, Filters & Tags:**
   - Keyword search across entries.
   - Filter by date, mood range, and tags.
   - Results load quickly (<2 seconds).

6. **Insights Dashboard:**
   - Mood trend over time, energy & stress trends, entry streak counter, most used tags.
   - Charts auto-update with new data.

7. **Reminders & Notifications:**
   - Daily reminder email via **Resend API** with optional second reminder if entry not completed.
   - Email contains a direct link to open the journal entry screen.

8. **Export & Data Ownership:**
   - Export to PDF (formatted) and CSV (raw data).
   - Share/download options with correct date range filtering.

9. **Newsletter Subscribe Component:**
    - Integrate an email capture form on the landing page for app updates and journaling tips.
    - The subscribe form must allow users to choose between a **Free** or **Premium ($5/mo)** plan.
    - Selecting Premium redirects the user to **Stripe Checkout** to complete payment.

10. **Unsubscribe Component:**
    - Allow subscribers to unsubscribe from the newsletter at any time.
    - Secure unsubscribe links appended to every outgoing email.

11. **Manage Payment Component:**
    - Allow subscribers to unsubscribe, refund, or cancel their premium subscriptions through Stripe.

---

## 🔒 3. Privacy & Security Requirements

- HTTPS encryption for all communications.
- Data encrypted at rest.
- Each user's data isolated (multi-tenant security).
- Delete account & erase all data option (GDPR compliant).
- All secret keys (Stripe, Resend, Supabase, etc.) stored in environment files and never exposed on the frontend.

---

## 🎨 4. UX/UI Principles

- Mobile-first responsive web design with calm & minimal interface.
- Large tap targets for easy mobile interaction.
- Dark mode support.
- Entry completion target: under 3 minutes.

---

## 🗄️ 5. Database Design

The database schema is managed via **Prisma** with **PostgreSQL**:

### `User` Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `name` (String)
- `timezone` (String)
- `reminderTime` (Time)
- `privacyPreferences` (JSON)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### `JournalEntry` Table
- `id` (UUID, Primary Key)
- `userId` (FOREIGN KEY to `User`)
- `date` (Date)
- `mood` (Integer, 1–10)
- `energy` (Integer, 1–10)
- `stress` (Integer, 1–10)
- `gratitude` (String)
- `mainFocus` (String)
- `wins` (String)
- `challenges` (String)
- `learned` (String)
- `tags` (String[])
- `photoUrl` (String, Optional)
- `isDraft` (Boolean)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### `SharedEntry` Table
- `id` (UUID, Primary Key)
- `entryId` (FOREIGN KEY to `JournalEntry`)
- `shareToken` (String, Unique)
- `isActive` (Boolean)
- `showAuthorName` (Boolean)
- `showMoodSummary` (Boolean)
- `createdAt` (DateTime)

### `Subscriber` Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `plan` (Enum: `FREE`, `PREMIUM`)
- `status` (Enum: `ACTIVE`, `UNSUBSCRIBED`)
- `stripeCustomerId` (String, Optional)
- `stripeSubscriptionId` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

---

## 👤 6. User Flow Summary

### Daily Flow:
Open app → Tap "Today" → Complete entry → Save → (optional share)

### Weekly Flow:
Open insights → Review mood & trends → Reflect

---

## 🚀 7. Phase 2 Enhancements (Future)

1. Share with friends/community.
2. Voice journaling & speech-to-text.
3. AI insights & summaries.
4. Multiple journal templates.
5. Habit tracking integration.
6. Passcode/FaceID lock.
7. Community challenges & streaks.
8. Cloud sync — real-time sync across devices, offline entry with auto-sync, data backup protection.

---

## 💰 8. Future Monetization (Optional)

- Premium templates.
- AI insights.
- Guided journaling programs.
- Therapist/coach sharing portal.
