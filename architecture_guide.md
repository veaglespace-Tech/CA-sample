# caproject Project Architecture & Structure Guide

This guide describes the clean, highly modular, and feature-separated architecture of the **caproject** codebase. The project is separated into a frontend Next.js App Router workspace (`client`) and a robust Express.js MVC backend (`server`).

---

## 📂 Core Folder Structure Overview

```
caproject Workspace
├── client (Next.js & Tailwind)
│   └── src
│       ├── app (Next.js Pages & Routes)
│       ├── components (Modular UI Components)
│       ├── store (Redux State & API RTK Query)
│       ├── hooks (Custom Reusable Hooks)
│       ├── lib (Utilities & Validators)
│       └── styles (Styling & CSS Tokens)
└── server (Express.js MVC Backend)
    └── src
        ├── config (DB & App Settings)
        ├── controllers (Business Logic)
        ├── middlewares (Auth & Upload guards)
        ├── routes (HTTP Endpoints)
        └── services (DB & Query Handling)
```

---

## 🖥️ Frontend Architecture (`client/src`)

The client is structured following modern React and Next.js best practices, using feature modularization to keep code simple and maintainable.

### 1. `src/app/` (Routing & Layouts)
Uses the **Next.js App Router** where each folder represents an HTTP route:
* `page.js` — The primary interactive Homepage.
* `contact/page.js` — The interactive contact page with clickable cards.
* `talk-to-expert/page.js` — Dedicated expert consultation lander.
* `dashboard/` — Interactive multi-role dashboard layouts supporting clients, staff, and super administrators.
* `login/` & `register/` — Client-side entryways.
* `admin/` — Secure administrative gateway (`/admin/login`).

### 2. `src/components/` (Feature-Separated Components)
Divided into domain folders for maximum cleanliness:
* `admin/` — Admin-only views (Users, Leads, Plans, Repository) and dialog forms.
  * `views/` — Cohesive table views (e.g. `AdminTable.js` containing our modern outlined badges).
  * `modals/` — Forms for creating/updating leads, plans, and files.
* `dashboard/` — Dashboard layouts and views:
  * `sections/` — Document workflows, active tickets, and chat views.
  * `sections/overview/` — Contain the state-of-the-art interactive KPI filtering grid (`StaffOverview.js`).
* `auth/` — Protected routing checks and `AuthForm.js` for handling clean login state updates.
* `forms/` — Dynamic forms, including `LeadForm.js` with integrated dynamic digit-only input filters.
* `layout/` — Persistent elements like `Header.js`, the fully redesigned minimalist `Footer.js`, and animated `FloatingWidgets.js`.
* `ui/` — Fine-grained components like `PasswordInput.js` and custom modal containers.

### 3. `src/store/` (State Management & API Connections)
Utilizes **Redux Toolkit (RTK) Query** for cached backend communication:
* `store/index.js` — Core redux store configuration.
* `store/api/` — Domain API slices (`authApi.js`, `leadApi.js`, `documentApi.js`) ensuring seamless client-server syncing.

### 4. `src/lib/` & `src/hooks/` (Logic & Reusability)
* `lib/validators.js` — Unified regex checks (Phones, emails, Indian states).
* `hooks/useLiveValidation.js` — High-performance input monitoring.

---

## ⚙️ Backend Architecture (`server/src`)

The backend follows a classic, clean **MVC Layered Pattern** for simplicity and security.

### 1. Controllers (`src/controllers/`)
Extracts parameters, handles request sanitization, and returns structured JSON responses:
* `auth/authController.js` — Controls user registrations and secure token generation.
* `admin/adminController.js` — Manages platform settings, user databases, and global stats collections.
* `client/documentController.js` — Safely processes customer identity uploads.

### 2. Routes (`src/routes/`)
Defines clean paths and ties together middlewares and controllers:
* `authRouter.js` — Public and client endpoints.
* `adminRouter.js` — Middleware-shielded endpoints accessible solely by `STAFF` and `SUPER_ADMIN` roles.

### 3. Services (`src/services/`)
Encapsulates database access (PostgreSQL via Sequelize/SQL queries), ensuring database operations are abstracted away from routers:
* `admin.js` — Computes overall platform summaries and logs database statistics.
* `registrations.js` — Dispatches database writes for active service filings.

---

## ✨ Code & Architecture Quality Highlights

1. **Strict Code Separation:** Controllers contain *no* raw routing logic, and routers contain *no* business operations. 
2. **On-the-fly Input Sanitization:** Phone fields dynamically strip alphabets on input changes (preventing dirty db records before submit triggers).
3. **Reusable Design Tokens:** Colors, shadows, and card templates (`vx-contact-card`, `vx-form-panel`) are written as reusable standard variables, making visual overrides uniform.
4. **Dynamic UI States:** Elements like dashboard KPI cards double as active filters to dynamically subset table records without querying the server again, reducing overhead.
