<div align="center">

<!-- Animated Wave Header -->
<img src="https://capsule-render.vercel.app/api?type=waving&height=210&color=0:f97316,100:22c55e&text=Rock%20Paper%20Scissors%20Dynamic%20Genius&fontSize=56&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Markov%20bot%20%20%7C%20%20Stats%20dashboard%20%20%7C%20%20React%20UI%20%20%7C%20%20Express%20API%20%20%7C%20%20PostgreSQL&descAlignY=58" />

<!-- Typing SVG -->
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=3000&pause=700&color=F97316&center=true&vCenter=true&width=900&lines=Modern+full-stack+app+ready+for+portfolio;PostgreSQL+powered+data+dan+Drizzle+schema;Includes+CodePen+standalone+demo+in+codepen%2F" />

<p>
  <img src="https://img.shields.io/badge/Node.js-ESM-informational" />
  <img src="https://img.shields.io/badge/Express-API-blue" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-success" />
  <img src="https://img.shields.io/badge/Platform-Windows%20friendly-22c55e" />
</p>

</div>

---

## 🧾 Description
🪨📄✂️ Dynamic Genius RPS modern: bot cerdas Markov, statistik real-time, UI React, dan backend Express dengan PostgreSQL. 🎯🧠

---

## ✨ Features
- ✅ React client UI dan Express API
- 🗄️ PostgreSQL database via Drizzle ORM
- 🧯 Centralized request logging and consistent JSON responses
- 🪄 CodePen-ready standalone demo in `codepen/` (copy–paste to CodePen)

---

## 🚀 Run Locally (Windows PowerShell)

### 1) Start PostgreSQL with Docker
```powershell
docker compose up -d
```

### 2) Set environment variables
```powershell
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app"
$env:HOST="127.0.0.1"
$env:PORT="5000"
```

### 3) Install and migrate schema
```powershell
npm install
npm run db:push
```

### 4) Start dev server
```powershell
npm run dev
```

Open:
- http://127.0.0.1:5000

---

## 🧪 CodePen Demo
Open https://codepen.io/your-work then create a new Pen and copy:
- `codepen/pen.html` → HTML
- `codepen/pen.css` → CSS
- `codepen/pen.js` → JS

---

## 🗂️ Project Structure
```text
.
├── client/
├── server/
├── shared/
├── codepen/
├── docker-compose.yml
└── README.md
```

---

## 📄 License
MIT
