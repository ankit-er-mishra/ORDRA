# 🛡️ Ordra — Post-Purchase Trust System

<p align="center">
  <strong>Transform post-purchase anxiety into confidence.</strong><br>
  Real-time verified order tracking with emotional intelligence.
</p>

---

## What is Ordra?

Ordra solves the **Post-Purchase Trust Gap** — the anxiety users feel after placing an order when the platform goes silent. It transforms a static order confirmation into a **live, trust-building experience** with:

- ✅ **Verified proof** of every backend action (payment, inventory, seller acknowledgment)
- 📊 **Confidence scoring** that updates in real-time
- 🔒 **Order Assurance Ledger™** — a downloadable PDF with cryptographic verification
- 🎯 **Emotional Intelligence** — smart banners that detect delays and reassure
- ⚡ **Live Socket.io updates** — watch your order progress in real-time

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Tailwind CSS v4 + Framer Motion |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite (dev) / PostgreSQL (production) with Prisma ORM |
| Real-time | Socket.io |
| PDF | PDFKit + QRCode |
| State | Zustand + React Query |
| Deployment | Docker + docker-compose |

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Setup Database

```bash
cd backend
npx prisma migrate dev --name init
# This automatically seeds the database with 5 demo orders
```

### 3. Start Development Servers

```bash
# Terminal 1 — Backend (port 3001)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

### 4. Open in Browser

Visit `http://localhost:5173` — you're all set! 🎉

## Demo Orders

| Order ID | Product | Stage | Confidence |
|----------|---------|-------|------------|
| ORD-2024-7891 | Samsung Galaxy S24 Ultra | 4/8 stages | 92% |
| ORD-2024-7892 | Nike Air Max 270 React | 2/8 stages | 88% |
| ORD-2024-7893 | Bosch Washing Machine | 1/8 stages | 95% |
| ORD-2024-7894 | Levi's Denim Jacket | 5/8 ⚠️ ATTENTION | 74% |
| ORD-2024-7895 | MacBook Air M3 | Delivered ✅ | 100% |

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with Ordra branding and demo CTA |
| `/demo` | Auto-loads a demo order with live simulation controls |
| `/order/:orderId` | Full order trust experience |
| `/embed/:orderId` | Embeddable iframe version (minimal chrome) |

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/orders/:orderId` | Full order with events & ledger |
| GET | `/api/orders/:orderId/journey` | Timeline events |
| GET | `/api/orders/:orderId/ledger` | Ledger entries |
| GET | `/api/orders/:orderId/pdf` | Download Assurance Ledger PDF |
| GET | `/api/orders/:orderId/confidence` | Confidence score & prediction |
| POST | `/api/orders` | Create new order |
| POST | `/api/orders/:orderId/events` | Add event |
| POST | `/api/simulate/:orderId` | Start auto-progression |
| POST | `/api/simulate/:orderId/stop` | Stop simulation |
| POST | `/api/simulate/:orderId/reset` | Reset order |
| WS | `/socket.io` | Real-time order events |

## Docker Deployment

```bash
docker-compose up --build
```

This starts:
- **PostgreSQL** on port 5432
- **Backend API** on port 3001
- **Frontend** on port 3000

## Project Structure

```
ORDRA/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   ├── seed.ts                # Demo data
│   │   └── migrations/
│   ├── src/
│   │   ├── index.ts               # Express + Socket.io server
│   │   ├── socket.ts              # WebSocket setup
│   │   ├── routes/
│   │   │   ├── orders.ts          # Order API routes
│   │   │   └── simulate.ts        # Simulation routes
│   │   └── services/
│   │       ├── simulation.ts      # Auto-progression engine
│   │       └── pdf.ts             # PDF generation
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/            # Navbar, Footer
│   │   │   └── order/             # All order components
│   │   ├── pages/                 # Landing, OrderPage, Demo, Embed
│   │   ├── lib/                   # API, socket, store, types, utils
│   │   ├── App.tsx
│   │   └── index.css              # Design system
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Design System

- **Primary**: Deep Indigo `#6C63FF`
- **Success**: Emerald `#10B981`
- **Warning**: Amber `#F59E0B`
- **Danger**: Rose `#F43F5E`
- **Font**: Plus Jakarta Sans + Inter
- **Dark mode**: Full support via Tailwind `dark:` classes
- **Animations**: Framer Motion with spring physics

---

Built with 💜 by Ordra
