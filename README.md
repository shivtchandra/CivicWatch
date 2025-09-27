

# 🛡️ CivicWatch

[https://purpose-driven-creations-hub.lovable.app/](https://purpose-driven-creations-hub.lovable.app/)

> **Where Serious Issues Get Serious Attention**

CivicWatch is a purpose-built, community-first platform that empowers users to report crimes, fraud, missing persons, lost items, and civic infrastructure issues — all in **real-time** with **real impact**.

Unlike social media platforms built for entertainment, CivicWatch ensures that **serious issues receive the focused attention they deserve**, turning isolated incidents into actionable, community-driven alerts.

---

## 🌍 Why CivicWatch?

Social feeds are noisy. Important community alerts get lost in between memes, trends, and viral content.

CivicWatch changes that:

* 🚨 **Focused Attention**: No distractions — just public safety and community well-being.
* ⚡ **Swift Reporting**: Optimized for urgent, effective reporting — when time matters most.
* 🛠️ **Real Impact**: Each report powers real, measurable change — not just likes.
* 👁️‍🗨️ **Community Visibility**: Collective awareness reduces response times and deters crime.

---

## 🔑 Key Features

* 📢 **Safety Alerts**: Missing persons, lost & found, emergencies.
* 🏙️ **Civic Reports**: Infrastructure, sanitation, transport issues.
* 📍 **Location-based Reporting**: Submit incidents with location context.
* 📷 **Image Uploads** *(planned)*: Reports can include proof.
* 🔄 **Real-Time Feed**: Live updates on community issues.
* 🔒 **Authentication**: Secure login & profile system.

---

## 🏗️ Tech Stack

### 🔧 Frontend

* **React (TypeScript)** – UI
* **Vite** – Fast dev/build
* **Tailwind CSS** – Styling
* **shadcn/ui** – UI components
* **lucide-react** – Icons

### ⚙️ Backend

* **Node.js + Express** – API server
* **Prisma ORM** – Database access
* **PostgreSQL** – Database (running in Docker)

### 🛠️ Dev Tools

* **Docker Compose** – Postgres + Adminer + API server
* **Nodemon** – Auto-restart backend
* **Zod + React Hook Form** – Validation + forms

---

## 📂 Project Structure

```
📦 civicwatch/
├── backend/                # Node.js + Express + Prisma API
│   ├── src/server.js       # API entrypoint
│   └── prisma/             # Prisma schema & migrations
├── src/                    # Frontend (React + Vite)
│   ├── components/         # Reusable UI
│   ├── hooks/              # React hooks
│   ├── lib/                # API client wrapper
│   ├── pages/              # Main pages
│   └── App.tsx             # App root
├── docker-compose.yml      # Services: Postgres, Adminer, Backend
├── .env.example            # Example environment config
├── package.json            # Dependencies
└── README.md               # Documentation
```

---

## 💻 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/shivtchandra/CivicWatch.git
cd CivicWatch
```

### 2. Setup Environment Variables

Copy `.env.example` → `.env` and update values if needed:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/civicwatch"



# Frontend API base
VITE_API_BASE="http://localhost:4000/api"
```

### 3. Run Backend (API + DB)

```bash
cd backend
docker compose up --build
```

This will start:

* **Postgres** (port `5432`)
* **Adminer** (port `8080`) → GUI for DB
* **Backend API** (port `4000`)

Check:

```bash
curl http://localhost:4000/api/health
```

### 4. Run Frontend

Open another terminal:

```bash
npm install
npm run dev
```

Frontend will run at:
👉 [http://localhost:5173](http://localhost:5173)

---

## 🔄 Deployment

Currently designed for **local Postgres (Docker)**.
Future deployment options:

* AWS (RDS for Postgres + ECS/Fargate for backend + S3 for uploads)
* Vercel/Netlify (frontend hosting)

---

## 📌 Roadmap

* ✅ Core reporting system (alerts + civic reports)
* ✅ Authentication & profiles
* 🔄 Image uploads (integrate with AWS S3 / Supabase storage)
* 🔄 Notifications (Web Push / Email)
* 🔄 Government portal integration
* 🔄 Mobile app version

---

## 🤝 Contributing

1. Fork this repo
2. Create a new branch: `git checkout -b feat/feature-name`
3. Commit changes: `git commit -m "feat: add X"`
4. Push branch: `git push origin feat/feature-name`
5. Open Pull Request

---

## 📫 Contact

Maintainer: [shivachandra9490@gmail.com](mailto:shivachandra9490@gmail.com)

---

## ⭐ Support the Mission

If you believe in community-driven public safety, star ⭐ this repo!

**CivicWatch – Because Real Issues Deserve Real Action.**

