# QuickBite 🍽️  
A QR-based self-ordering web application for restaurants  
Developed as part of the Capstone Design 2 project at Seoul National University of Science and Technology

---

## 📌 Overview

QuickBite allows restaurant customers to scan a table-specific QR code, log in, view the menu, and place their order from their own devices. On the restaurant owner’s side, the system provides tools to register restaurants, manage menus and tables, receive orders in real time, and view sales data.

---

## 🛠️ Tech Stack

- **Frontend:** React.js (with Vite)
- **Backend-as-a-Service:** Supabase (Auth, PostgreSQL DB, Storage)
- **Deployment:** Render
- **QR Generator:** `qrcode.react` npm package

---

## 👥 User Roles

### Customer
- Scan QR code (includes restaurant ID and table number)
- Login required
- Browse menu, add comments (e.g. allergies), and place orders

### Restaurant Owner
- Login and dashboard access
- Register restaurant (multi-step form)
- Add/edit/delete menu items with image upload
- Manage tables and receive real-time orders
- View sales summaries

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v16 or higher)
- Supabase project (or clone the schema from this repo)
- `.env` file with your Supabase keys

### Steps
```bash
git clone https://github.com/Badrelmb/quickBite.git
cd quickBite
npm install
npm run dev
