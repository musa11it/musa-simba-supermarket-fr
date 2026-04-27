# 🛒 Simba Supermarket — Frontend

<div align="center">

![Simba Supermarket](https://img.shields.io/badge/Simba-Supermarket-dc2626?style=for-the-badge&logo=shopping-cart&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Rwanda's #1 Supermarket — Online Shopping & Pick-Up Platform**

[🌐 Live Demo](https://musa-simba-supermarket-fr-6o8l.vercel.app) · [🔧 Backend Repo](https://github.com/musa11it/musa-simba-supermarket-bk) · [📋 Report Bug](https://github.com/musa11it/musa-simba-supermarket-fr/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Pages & Routes](#-pages--routes)
- [User Roles](#-user-roles)
- [Multi-Language Support](#-multi-language-support)
- [Demo Credentials](#-demo-credentials)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)

---

## 🌟 Overview

Simba Supermarket 2.0 is a full-featured e-commerce platform for Rwanda's largest supermarket chain. Customers can browse products, add to cart, select a pick-up branch, and pay via MTN Mobile Money. Admins manage orders through a real-time dashboard with role-based access control.

---

## ✨ Features

### 🛍️ Customer
- Browse **500+ products** across 10 categories
- **AI-powered search** in English, Kinyarwanda & French
- Add to cart and checkout with **MTN MoMo payment**
- Select pick-up time slot from **11 branches** across Rwanda
- Track order status in real-time (Accepted → Preparing → Ready → Completed)
- Leave reviews after completed orders
- Full account management

### 👨‍💼 Admin (Branch Manager)
- Real-time order management dashboard
- Full pickup flow: Accept → Prepare → Mark Ready → Complete
- Assign orders to staff members
- Mark no-shows (auto-increases customer deposit)
- Inventory management with low stock alerts
- Staff management

### 👑 Super Admin
- Global dashboard with network-wide stats
- **Branch approval workflow** — approve or reject new branch applications
- Manage all branches, users, products and categories
- View all orders across all branches

### 👷 Staff
- View assigned orders
- Mark orders as Ready / Completed

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.2 | UI framework |
| **TypeScript** | 5.2 | Type safety |
| **Vite** | 5.0 | Build tool & dev server |
| **Tailwind CSS** | 3.3 | Styling |
| **React Router** | 6.20 | Client-side routing |
| **Axios** | 1.6 | HTTP client |
| **Zustand** | 4.4 | State management |
| **i18next** | 23.7 | Internationalization (EN/RW/FR) |
| **Framer Motion** | 10.16 | Animations |
| **React Hot Toast** | 2.4 | Notifications |
| **Lucide React** | 0.294 | Icons |

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── layout/          # Header, Footer, Logo, LanguageSwitcher
│   │   ├── ui/              # Button, Input, Card, Badge, Modal, Spinner
│   │   ├── products/        # ProductCard
│   │   ├── chatbot/         # AI Chatbot widget
│   │   └── ProtectedRoute   # Role-based route guard
│   ├── contexts/
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── CartContext.tsx  # Shopping cart state
│   ├── i18n/
│   │   ├── en.json          # English translations
│   │   ├── rw.json          # Kinyarwanda translations
│   │   └── fr.json          # French translations
│   ├── layouts/
│   │   ├── CustomerLayout   # Header + Footer + Chatbot
│   │   └── DashboardLayout  # Sidebar + Topbar for all roles
│   ├── lib/
│   │   ├── api.ts           # Axios client with interceptors
│   │   └── utils.ts         # Helpers (formatCurrency, getLocalizedField...)
│   ├── pages/
│   │   ├── HomePage         # Landing page
│   │   ├── ProductsPage     # Product catalog with filters
│   │   ├── ProductDetailPage
│   │   ├── BranchesPage     # All 11 Simba branches
│   │   ├── CartPage
│   │   ├── CheckoutPage     # Branch select + time slot + MoMo payment
│   │   ├── AboutPage
│   │   ├── auth/            # Login, Register, ForgotPassword, ResetPassword
│   │   ├── customer/        # Account, Orders, OrderDetail
│   │   ├── admin/           # Dashboard, Orders, Inventory, Staff, Products
│   │   ├── superadmin/      # Dashboard, PendingBranches, Branches, Users, Products, Categories
│   │   └── staff/           # StaffDashboard
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   ├── App.tsx              # Router configuration
│   └── main.tsx             # Entry point
├── .env                     # Environment variables
├── index.html
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js **18+**
- Backend API running (see [backend repo](https://github.com/musa11it/musa-simba-supermarket-bk))

### Installation

```bash
# Clone the repository
git clone https://github.com/musa11it/musa-simba-supermarket-fr.git
cd musa-simba-supermarket-fr

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

For production (Vercel):
```dotenv
VITE_API_URL=https://your-backend.up.railway.app/api
```

---

## 📄 Pages & Routes

### Public Routes
| Route | Page | Description |
|---|---|---|
| `/` | HomePage | Landing page with featured products |
| `/products` | ProductsPage | Full product catalog |
| `/products/:id` | ProductDetailPage | Product details |
| `/branches` | BranchesPage | All 11 Simba branches |
| `/branches/:id` | BranchDetailPage | Branch details & reviews |
| `/cart` | CartPage | Shopping cart |
| `/about` | AboutPage | About Simba Supermarket |

### Auth Routes
| Route | Page |
|---|---|
| `/login` | LoginPage |
| `/register` | RegisterPage |
| `/forgot-password` | ForgotPasswordPage |
| `/reset-password/:token` | ResetPasswordPage |

### Protected Customer Routes
| Route | Page |
|---|---|
| `/checkout` | CheckoutPage |
| `/account` | AccountPage |
| `/account/orders` | OrdersPage |
| `/account/orders/:id` | OrderDetailPage |

### Dashboard Routes
| Route | Role | Description |
|---|---|---|
| `/admin` | Admin | Branch dashboard |
| `/admin/orders` | Admin | Order management |
| `/admin/inventory` | Admin | Stock management |
| `/admin/staff` | Admin | Staff management |
| `/superadmin` | Super Admin | Global dashboard |
| `/superadmin/pending-branches` | Super Admin | Branch approvals |
| `/superadmin/branches` | Super Admin | All branches |
| `/superadmin/users` | Super Admin | All users |
| `/staff` | Staff | Assigned orders |

---

## 👥 User Roles

| Role | Access |
|---|---|
| **Customer** | Shop, checkout, track orders, leave reviews |
| **Staff** | View & complete assigned orders |
| **Admin** | Full branch management (orders, inventory, staff) |
| **Super Admin** | Full platform control (branches, users, products) |

---

## 🌍 Multi-Language Support

The app supports **3 languages** switchable from the header:

| Language | Code | Flag |
|---|---|---|
| English | `en` | 🇬🇧 |
| Kinyarwanda | `rw` | 🇷🇼 |
| French | `fr` | 🇫🇷 |

Language preference is saved to `localStorage` and persists across sessions.

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Super Admin | `superadmin@simba.rw` | `Simba@2026` |
| Branch Admin | `admin.remera@simba.rw` | `Admin@2026` |
| Staff | `staff.remera@simba.rw` | `Staff@2026` |
| Customer | `customer@simba.rw` | `Customer@2026` |

---

## 🚢 Deployment

### Deploy on Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your repository
4. Configure:
   - **Build Command:** `npx --yes vite build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install && chmod +x node_modules/.bin/vite`
5. Add Environment Variable:
   ```
   VITE_API_URL = https://your-backend.up.railway.app/api
   ```
6. Click **Deploy**

---

## 🏪 Simba Branches

The platform covers **11 real Simba Supermarket locations** across Rwanda:

| Branch | Location |
|---|---|
| City Centre | Union Trade Centre, KN 4 Ave, Kigali |
| Remera | KG 541 St, Remera |
| Kimironko | Kimironko, Kigali |
| Kacyiru | Kacyiru, Kigali |
| Nyamirambo | KG 192 St, Nyamirambo |
| Gikondo | Gikondo, Kigali |
| Kanombe | Kanombe, Kigali |
| Kinyinya | KK 35 Ave, Kinyinya |
| Kibagabaga | Kibagabaga, Kigali |
| Nyanza | Southern Province |
| Gisenyi | Western Province |

---

## 📜 Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## 👨‍💻 Author

**Musa** — [@musa11it](https://github.com/musa11it)

---

<div align="center">
Made with ❤️ in Rwanda 🇷🇼
</div>