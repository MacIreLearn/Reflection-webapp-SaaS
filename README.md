# Reflection - Daily Wellness Journal

![Reflection App Overview](webapp/public/Reflections_Git.png)

A premium, fast, and calming Web Journal App designed for mindfulness. Reflection helps users track their daily wellbeing, capture thoughts in under 3 minutes, and build self-awareness through a beautifully crafted interface.

## ✨ Key Features

- **Quick Daily Reflections**: Track your Mood, Energy, and Stress levels using intuitive sliders, alongside guided prompts for gratitude, daily focus, wins, and challenges.
- **Calming Visual Experience**: Features a stunning, interactive "Northern Lights" Aurora animated background, dark-mode glassmorphism UI, and smooth Framer Motion-style CSS physics inspired by top-tier SaaS landing pages.
- **Daily Affirmations**: Starts your day and your journaling sessions right with randomized, glowing daily affirmation cards.
- **Wellness Insights**: Beautiful, auto-updating charts (via Recharts) that help you visualize your mood, energy, and stress trends over time, complete with a daily streak counter.
- **Privacy-First & Secure**: Your entries are encrypted and private by default. Built with GDPR compliance in mind, featuring full data ownership.
- **Selective Sharing**: Generate secure, view-only web links for specific entries to share with friends, family, or therapists. Access can be revoked at any time.
- **Data Export**: Freedom to download your journal history as PDF or CSV files.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom Glassmorphism utilities
- **Database & ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Supabase Auth](https://supabase.com/) (SSR configured)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18.x or later
- A Supabase account (for Authentication and PostgreSQL database)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Reflection-webapp-SaaS/webapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy the example environment file and fill in your Supabase credentials:
   ```bash
   cp .env.local.example .env.local
   ```
   *Note: You will need `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and a `DATABASE_URL` (from Supabase).*

4. **Initialize the Database:**
   Push the Prisma schema to your Supabase PostgreSQL database:
   ```bash
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Testing Instructions (For Judges)

### Live Deployment
**URL**: [https://reflectionsaaswebapp.vercel.app](https://reflectionsaaswebapp.vercel.app)

### Quick Start Flow
1. **Sign Up**: Click "Start Journaling Free" → Enter email/password
2. **Create Entry**: After signup, you're redirected to "Today's Entry" → Complete the 3-minute flow
3. **View Timeline**: Go to Journal → See your entries in timeline/calendar view
4. **View Insights**: Go to Insights → See mood/energy/stress charts and streak
5. **Share an Entry**: Open any entry → Click "Share" → Copy the generated link
6. **Test Shared Link**: Open in incognito → Verify read-only view works without login

### Sample Shared Entry (Public)
> *[Add a working shared link here after creating an entry]*

### Stripe Test Mode
- **Premium Selection**: Newsletter form → Select "Premium — $5/mo" → Click "Subscribe & Pay"
- **Test Card**: `4242 4242 4242 4242` | Exp: any future date | CVC: any 3 digits
- **Manage Subscription**: Settings → "Manage Subscription" → Opens Stripe Customer Portal

### Implemented Features
| Feature | Status |
|---------|--------|
| Daily Entry (3-min flow) | ✅ |
| Mood/Energy/Stress Tracking | ✅ |
| Timeline & Calendar View | ✅ |
| Wellness Insights Dashboard | ✅ |
| Secure Sharing (Token-based) | ✅ |
| Share Revocation | ✅ |
| Data Export (CSV/PDF) | ✅ |
| Newsletter Signup | ✅ |
| Stripe Premium Checkout | ✅ |
| Stripe Customer Portal | ✅ |
| Daily Reminders (Vercel Cron) | ✅ |
| Rate Limiting | ✅ |
| Server Actions | ✅ |

### Environment Variables Needed
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
DIRECT_URL=

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email Reminders
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=onboarding@resend.dev
CRON_SECRET=<generated-secret>

# App
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🗺️ Roadmap (Phase 2 Enhancements)
- **AI Insights & Summaries**: Weekly AI-generated wrap-ups identifying mood patterns and triggers.
- **Voice Journaling**: Speech-to-text integration for hands-free reflection.
- **Multiple Templates**: Customizable journal templates for different reflection styles.
- **Habit Tracking**: Integration with daily habits directly tied to wellness scores.

---
*Built for mindfulness. The experience must be fast, calming, and usable in under 3 minutes. It's about consistency over perfection.*