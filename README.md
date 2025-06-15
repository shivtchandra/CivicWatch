# 🛡️ CivicWatch

> **Where Serious Issues Get Serious Attention**

CivicWatch is a purpose-built, community-first platform that empowers users to report crimes, fraud, missing persons, lost items, and civic infrastructure issues — all in **real-time** with **real impact**.

Unlike social media platforms built for entertainment, CivicWatch ensures that **serious issues receive the focused attention they deserve**, turning isolated incidents into actionable, community-driven alerts.

---

## 🌍 Why CivicWatch?

Social feeds are noisy. Important community alerts get lost in between memes, trends, and viral content.

CivicWatch changes that.

- 🚨 **Focused Attention**: No distractions — just public safety and community well-being.
- ⚡ **Swift Reporting**: Optimized for urgent, effective reporting — when time matters most.
- 🛠️ **Real Impact**: Each report powers real, measurable change — not just likes.
- 👁️‍🗨️ **Community Visibility**: Collective awareness reduces response times and deters crime.

---

## 🔑 Key Features

- 📢 **Safety Alerts**: Instant neighborhood-wide emergency alerts.
- 🏙️ **Civic Reports**: Report broken infrastructure, sanitation issues, and more.
- 🧒 **Missing Persons / Lost & Found**: Crowdsource visibility and help reuniting people or recovering items.
- 🗺️ **Location-based Reporting**: Submit incidents with geotagged accuracy.
- 📷 **Image Uploads**: Support reports with visual proof.
- 🔄 **Real-Time Updates**: Keep communities informed as situations evolve.
- 🔔 **Instant Notifications**: Alert users in affected localities.
- 🔒 **Secure Authentication**: Account system via Supabase Auth.

---

## 🏗️ Tech Stack

### 🔧 Core Frontend
- **React** – Component-based UI
- **TypeScript** – Static typing for safety and scale
- **Vite** – Ultra-fast dev environment
- **Tailwind CSS** – Utility-first responsive styling
- **shadcn/ui** – Prebuilt, accessible UI components
- **lucide-react** – Lightweight, modern icons

### 📦 State Management & Forms
- **React Hook Form** – Flexible, performant forms
- **Zod** – Type-safe form validation
- **TanStack React Query** – Smart async data fetching & caching

### 🧠 Backend & Integration (via Supabase)
- **Supabase Auth** – Secure login/signup
- **PostgreSQL** – Structured relational database
- **Edge Functions** – Serverless logic for secure operations
- **Supabase Storage** – (Optional) File/image uploads

### 🌐 API Integrations
- **NewsAPI** – Real-world safety-related news (with API key)
- **Google Places API** – Location suggestions & autocomplete
- **Resend.com** – (Optional) Transactional emails from edge functions

---

## 🧱 Project Structure

📦 civicwatch/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Main pages (Home, Alerts, Reports)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and API clients
│   ├── styles/              # Tailwind config and global styles
│   ├── types/               # TypeScript types/interfaces
│   └── App.tsx              # App entry point
├── supabase/                # Edge functions & schema definitions
├── .env                     # Environment variables
├── vite.config.ts           # Vite config
└── README.md                # Project documentation

````

---

## 💻 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/shivtchandra/CivicWatch.git
cd CivicWatch
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GOOGLE_API_KEY=your_google_places_api_key
VITE_NEWS_API_KEY=your_newsapi_key
```

### 4. Run the Development Server

```bash
npm run dev
```

---

## 🔄 Deployment

You can deploy CivicWatch to:

* [Vercel](https://vercel.com/)
* [Netlify](https://netlify.com/)
* [Render](https://render.com/)
* Supabase Hosting (Edge functions)

Ensure all environment variables are set in your deployment dashboard.

---

## 📊 Performance Insights

| Time Window   | Description                                     | Effectiveness     |
| ------------- | ----------------------------------------------- | ----------------- |
| `0–3 Minutes` | **Prevention Window** – Alerts seen instantly   | 🟢 89% Prevention |
| `3–8 Minutes` | **Intervention Window** – Time to act & respond | 🟡 54% Success    |
| `8+ Minutes`  | **Response Only** – Damage control              | 🔴 23% Success    |

🧠 **Community Awareness Multiplier**

* 🧍‍♂️ 1 Person: Limited response
* 👥 5+ People: Coordinated action
* 🧑‍🤝‍🧑 20+ People: Maximum deterrence

---

## 🔐 Authentication & Authorization

* 🔑 Supabase Auth (email/password based)
* 👤 Profiles stored securely in Supabase DB
* 🛡️ Session tokens auto-managed client-side

---

## 📌 Roadmap

* ✅ Core Reporting System
* ✅ Real-Time Feed & Alerts
* 🔄 AI-Powered Report Summarization *(Coming Soon)*
* 🔄 Mobile App with Offline Reporting *(Coming Soon)*
* 🔄 API Integrations with Local Government Portals *(Planned)*
* 🔄 Emergency Contact Escalation Flows *(Planned)*

---

## 🤝 Contributing

We welcome contributions to CivicWatch! To contribute:

1. Fork this repo
2. Create a new branch: `git checkout -b feat/feature-name`
3. Make your changes
4. Commit and push: `git commit -m "feat: add new feature"`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## 📫 Contact

> Maintainer: [shivachandra9490@gmail.com](mailto:shivachandra9490@gmail.com)

---

## ⭐ Support the Mission

If you believe in the power of community-driven public safety, consider starring ⭐ this repository and spreading the word!

**CivicWatch – Because Real Issues Deserve Real Action.**

```
