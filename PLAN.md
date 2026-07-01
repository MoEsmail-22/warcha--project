# Service Center Dashboard — Frontend Plan

> **Stack:** Vite + React (JavaScript) + Tailwind CSS + React Context + react-i18next (AR/EN, RTL)
> **Team:** Ahmed · Mohamed
> **Timeline:** 2 weeks · 10 phases (1 phase = 1 day)
> **Scope:** Frontend only — all data is mock JSON loaded through Context.

## Pages to Build (13 total)

| #  | Page                 | #  | Page                 |
| -- | -------------------- | -- | -------------------- |
| 1  | Dashboard Overview   | 8  | Technicians          |
| 2  | Jobs Board (Kanban)  | 9  | Notifications Center |
| 3  | Bookings             | 10 | Repair Jobs Board    |
| 4  | Revenue Analytics    | 11 | Quotes               |
| 5  | Vehicles             | 12 | Customers            |
| 6  | Services & Pricing   | 13 | Settings             |
| 7  | Reviews              |    |                      |

## Developer Roles

- **Ahmed** — Project setup, routing, app shell, sidebar, mock data, dashboard, bookings, vehicles, jobs board, quotes, reviews, responsive QA.
- **Mohamed** — Design system, i18n, topbar, charts, revenue, technicians, notifications, repair jobs board, customers, services & pricing, settings, RTL QA.

---

## Folder Structure

```
service-center-dashboard/
├── public/
│   └── locales/
│       ├── en/  (common, dashboard, bookings, quotes, customers, services,
│       │         vehicles, technicians, revenue, notifications, repairJobs,
│       │         reviews, settings, nav — one JSON per namespace)
│       └── ar/  (mirror of en/)
├── src/
│   ├── assets/                # icons, logos, illustrations
│   ├── components/
│   │   ├── ui/                # Button, Card, Badge, Input, Select, Toggle,
│   │   │                      # Modal, Drawer, Table primitives
│   │   ├── layout/            # AppLayout, Sidebar, Topbar, ProPlanCard
│   │   ├── widgets/           # StatCard, StatusBadge, RatingStars,
│   │   │                      # DataTable, EmptyState, ErrorState, SkeletonCard
│   │   ├── charts/            # RevenueBarChart, RevenueComparisonChart,
│   │   │                      # RatingBreakdownChart
│   │   └── kanban/            # KanbanBoard, KanbanColumn, KanbanCard
│   ├── context/
│   │   ├── LanguageContext.jsx
│   │   ├── AuthContext.jsx
│   │   ├── BookingsContext.jsx
│   │   ├── VehiclesContext.jsx
│   │   ├── JobsContext.jsx
│   │   ├── RepairJobsContext.jsx
│   │   ├── CustomersContext.jsx
│   │   ├── QuotesContext.jsx
│   │   ├── ServicesContext.jsx
│   │   ├── TechniciansContext.jsx
│   │   ├── ReviewsContext.jsx
│   │   ├── NotificationsContext.jsx
│   │   ├── RevenueContext.jsx
│   │   └── SettingsContext.jsx
│   ├── hooks/                 # useDebounce, useAppTranslation
│   ├── mocks/                 # *.json mock datasets (one per entity)
│   ├── pages/
│   │   ├── DashboardPage/
│   │   ├── JobsBoardPage/
│   │   ├── BookingsPage/
│   │   ├── QuotesPage/
│   │   ├── CustomersPage/
│   │   ├── ServicesPricingPage/
│   │   ├── VehiclesPage/
│   │   ├── TechniciansPage/
│   │   ├── RevenuePage/
│   │   ├── NotificationsPage/
│   │   ├── RepairJobsPage/
│   │   ├── ReviewsPage/
│   │   └── SettingsPage/
│   ├── routes/                # router config, lazy imports
│   ├── utils/                 # cn(), formatters, constants, navItems
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .eslintrc.cjs
├── .prettierrc
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── index.html
└── package.json
```

---

## The 10 Phases

### Phase 1 — Project Setup & Design System
**Day 1**

**Ahmed**
- Initialize Vite + React project, install Tailwind CSS 3 + PostCSS.
- Configure path alias `@/` → `src/`.
- Install dependencies: `react-router-dom`, `react-i18next`, `i18next`, `lucide-react`, `recharts`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `date-fns`, `react-hook-form`, `clsx`, `tailwind-merge`.
- Set up ESLint + Prettier + Husky + lint-staged.
- Create the folder structure above.
- Initialize Git, write `.gitignore`, open initial PR.

**Mohamed**
- Define Tailwind theme tokens: primary teal `#0D4D47`, light teal `#A8D8D8`, orange `#FFA500`, status colors (pending, confirmed, in_progress, cancelled, completed, delayed, urgent), neutrals.
- Configure fonts: Inter (Latin) + Cairo/Tajawal (Arabic).
- Build UI primitives in `src/components/ui/`: Button, Card, Badge, Input, Select, Toggle, Modal, Drawer, Table primitives.
- Build `cn()` utility in `src/utils/cn.js`.
- Create `/dev` showcase route rendering every primitive in every variant.

---

### Phase 2 — Routing, App Shell & i18n
**Day 2**

**Ahmed**
- Configure React Router 6 with `createBrowserRouter` in `src/routes/index.jsx`.
- Define all 13 routes with `React.lazy` + `Suspense` + `<RouteFallback>` spinner.
- Build `AppLayout` (grid: sidebar + main with `<Topbar />` + `<Outlet />`), RTL-aware.
- Build `Login` page (mock auth — any credentials log in).
- Create `AuthContext` with mock owner profile (`{ name: 'Ahmed Auto', role: 'Owner', avatar: 'AA' }`).
- Add `ProtectedRoute` redirecting to `/login` when not authenticated.
- Add `NotFound` (404) page.

**Mohamed**
- Install `react-i18next` + `i18next-browser-languagedetector`.
- Create `src/i18n.js` with namespaces: `common`, `nav`, and one per page.
- Seed `public/locales/en/` and `public/locales/ar/` — fill `nav` and `common` fully, placeholders for others.
- Create `LanguageContext`: holds `ar` | `en`, persists to `localStorage`, calls `i18n.changeLanguage`, sets `document.documentElement.lang` + `dir`.
- Add language toggle (globe icon + "AR"/"EN").
- Verify switching language flips layout direction (sidebar moves, text alignment flips).
- Use Tailwind logical properties (`ps-`/`pe-`/`ms-`/`me-`) to minimize RTL overrides.

---

### Phase 3 — Sidebar, Topbar & Mock Data Layer
**Day 3**

**Ahmed**
- Build `Sidebar` matching dark-teal mockup:
  - Nav items from `src/utils/navItems.js` (`{ key, labelKey, icon, path }`): Dashboard, Jobs Board, Bookings, Quotes, Customers, Services & Pricing, Reviews, Settings.
  - Active state: orange left-border (right-border in RTL) + lighter background.
  - Sidebar header: "Warsha" + "Ahmed Auto Service".
  - Footer: `ProPlanCard` (dark teal, star icon, "Pro Plan", "Renews Jun 2026 · 12 jobs left today").
  - Collapsible to icon-only on desktop; slide-in drawer on mobile.

**Mohamed**
- Build `Topbar`: workshop name + role, global search input, notification bell with unread count, language toggle, user avatar, hamburger menu.
- Create mock JSON datasets in `src/mocks/`: `bookings.json`, `vehicles.json`, `jobs.json`, `repairJobs.json`, `customers.json`, `quotes.json`, `services.json`, `technicians.json`, `reviews.json`, `notifications.json`, `revenue.json`, `settings.json`.
- For each entity, scaffold a Context provider using `useReducer` — exposes `{ data, loading, error }` + entity-specific actions.
- Wire every Context provider in `App.jsx`.

---

### Phase 4 — Dashboard Overview Page & Shared Widgets
**Day 4**

**Ahmed**
- Build `DashboardPage`:
  - Time-of-day greeting ("Good morning, Ahmed") + subtitle.
  - "New booking" primary button.
  - 4 KPI cards: Today's bookings (`8`, +2 vs yesterday), Cars in service (`3`, 2 awaiting approval), Revenue today EGP (`12,450`, +18%), Average rating (`4.8`, 124 reviews).
  - Two-column layout: Today's schedule table (Customer, Service, Time, Status) + Revenue this week bar chart.
  - "View all" link → `/bookings`.
  - Pull data from `BookingsContext`, `VehiclesContext`, `ReviewsContext`, `RevenueContext`.

**Mohamed**
- Build reusable widgets in `src/components/widgets/`: `StatCard`, `StatusBadge`, `RatingStars`, `DataTable`, `EmptyState`, `ErrorState`, `SkeletonCard`.
- Build `RevenueBarChart` (Recharts): horizontal bars Mon–Sun, current day highlighted, EGP tooltip, responsive in 1/3-width container.
- Build `MiniTrend` inline indicator (+2 vs yesterday with up/down arrow).
- Make all widgets RTL-aware.
- Add widgets to `/dev` showcase.

---

### Phase 5 — Bookings Page & Revenue Analytics Page
**Day 5**

**Ahmed — Bookings Page**
- Page header: "Bookings" + subtitle.
- Time filter tabs: Today · Week · Month.
- "Filters" button (drawer with status checkboxes) + "New Booking" button (modal).
- 6 stat cards: Total, Today's, Completed, In Progress, Cancelled (each with trend/subtitle).
- Bookings table: Booking ID, Customer, Vehicle, Service, Technician, Date/Time, Status, Actions (three-dot menu).
- Status badges: Pending, Confirmed, In Progress, Cancelled, Completed.
- Client-side pagination; row hover; three-dot dropdown (View, Edit, Cancel).
- Pull from `BookingsContext`.

**Mohamed — Revenue Analytics Page**
- Page header: "Revenue Insights" + subtitle.
- Top-right: "Export Report" button + "Last 30 Days" dropdown.
- 4 metric cards: Today's Revenue (+12%), Monthly Revenue (+8.4%), Avg Order Value (−2.1%), Outstanding (14 invoices).
- Main chart: `RevenueComparisonChart` — daily revenue bars, two series (Current Month dark teal / Previous Month light gray) with legend.
- Right sidebar: Quick Summary (Highest Revenue Day, Avg Daily Revenue, Profit Margin, Top Selling Service).
- Pull from `RevenueContext`.

---

### Phase 6 — Jobs Board & Repair Jobs Board (Kanban)
**Day 6**

**Ahmed — Jobs Board**
- Page header: "Jobs Board" + subtitle "Drag cars across stages as you work..."
- "2 quotes pending" orange button → `/quotes`.
- Kanban 4 columns: New (car icon, blue), Diagnosing (wrench, gray), In Progress (clock, gray), Ready (checkmark, green) — each with count badge.
- Job cards: car model, service type, technician initials avatar + time.
- DnD with `@dnd-kit`: sortable within column, draggable across columns, `DragOverlay` preview, keyboard accessible.
- On drop, dispatch `moveJobStage(jobId, newStage)` to `JobsContext`.
- Card click opens side drawer with job details.

**Mohamed — Repair Jobs Board**
- Coordinate with Ahmed in morning sync on shared `src/components/kanban/` primitives.
- Page header: "Repair Jobs Board" + subtitle.
- "Create Repair Job" button (opens modal) + "Filters" button.
- 4 stat cards: Open Jobs (14), In Progress (08), Completed (32), Delayed (03).
- Kanban 3 columns: Inspection · Approval · Parts.
- Cards: vehicle thumbnail, vehicle name + plate, priority badges (High red, Pending Quote orange), "View Quote" button → `/quotes/:id`.
- Same `@dnd-kit` DnD pattern.
- Pull from `RepairJobsContext`.

---

### Phase 7 — Vehicles Page & Technicians Page
**Day 7**

**Ahmed — Vehicles Page**
- Page header: "Vehicles" + subtitle.
- 4 stat cards: Total Fleet (148, +12 this month), In Service (24, 4 high priority), Waiting Pickup (8, Notify owners), Completed Today (15, 100% capacity).
- Filter row: "All Manufacturers" dropdown, "All Statuses" dropdown, grid/list toggle, "Add Vehicle" button.
- Table view: Vehicle, Plate / Owner, Stage, Technician, Est. Done — stage badges (Diagnosing blue, In Service green, Delayed red "(2d)", Waiting Pickup orange, Completed gray).
- Grid view: vehicle cards with thumbnail, plate, owner, stage badge.
- Client-side filtering by manufacturer + status.

**Mohamed — Technicians Page**
- Page header: "Technicians" + subtitle.
- "Add Technician" button (opens modal: name, specialization, phone).
- "Specialization" dropdown filter.
- 4 stat cards: Total Staff (14), Available Now (8), Peak Hours (4), Annual Leave (2).
- Technician cards grid: avatar, name, specialization, rating stars, availability badge (Available green / In Service blue / On Leave orange), quick stats, action menu.
- Card click opens detail drawer with full profile + assigned jobs list.
- Pull from `TechniciansContext`.

---

### Phase 8 — Quotes, Customers & Services & Pricing Pages
**Day 8**

**Ahmed — Quotes Page**
- Page header: "Quotes" + subtitle.
- Stat cards: Total Quotes, Pending, Accepted, Expired.
- Filter tabs: All · Draft · Sent · Accepted · Rejected · Expired.
- "Create Quote" button → multi-step modal: (1) select customer (2) select vehicle (3) add line items from `ServicesContext` + custom lines (4) review totals (subtotal, tax, discount, total) and submit.
- Quotes table: Quote #, Customer, Vehicle, Total EGP, Status, Created Date, Actions.
- Row click opens quote detail drawer with line items + "Send to customer" / "Convert to Booking" buttons.
- Pull from `QuotesContext`.

**Mohamed — Customers Page + Services & Pricing Page**

*Customers Page:*
- Page header: "Customers" + subtitle.
- Stat cards: Total Customers (342), New This Month (28).
- Search bar (name, phone, plate).
- Customer table/cards: Name, Phone, Plate, # Vehicles, Last Visit, Total Spent.
- Row click opens detail drawer: contact info, vehicles list, recent bookings, total revenue.
- "Add Customer" button → form modal.

*Services & Pricing Page:*
- Page header: "Services & Pricing" + subtitle.
- Category filter (Maintenance, Repair, Diagnostics, Bodywork).
- "Add Service" button → modal: Name (EN + AR), Category, Price EGP, Duration, Description.
- Services table: Service Name, Category, Duration, Price, Status (Active/Inactive), Actions (Edit, Delete, Duplicate).
- Bilingual: each service has EN + AR names; display current-language name.
- Pull from `CustomersContext` and `ServicesContext`.

---

### Phase 9 — Reviews, Notifications Center & Settings Pages
**Day 9**

**Ahmed — Reviews Page**
- Page header: "Reviews" + subtitle "4.8 average · 124 reviews · respond to build trust".
- Two-column layout:
  - Left (2/3): "Recent reviews" list — avatar + name, rating stars, review text, timestamp, "Reply" button (opens inline reply input; on submit marks as replied). Already-replied reviews show reply + "Edit reply" link.
  - Right (1/3): "Rating breakdown" horizontal bar chart (5★ to 1★, orange bars, counts 86/28/7/2/1).
- Filter tabs: All · Unreplied · 5 Star · 4 Star · Critical (≤2★).
- Build `RatingBreakdownChart`.
- Pull from `ReviewsContext`.

**Mohamed — Notifications Center & Settings Page**

*Notifications Page:*
- Page header: "Notifications Center" + subtitle.
- 4 summary cards: Unread (14, +3), Today's (28, Busy Day), High Priority (3, URGENT), Inventory Alerts (5, Check Stock).
- Filter tabs: All · Unread · Priority · Archived.
- Activity feed: icon + title + context + timestamp + status badge (CRITICAL red, SUCCESS green, INFO blue) + action button.
- Right sidebar: "Browse by Category" (Bookings, Vehicle Status, Low Inventory, Payments) + "Alert Preferences" widget → `/settings#preferences`.
- Mark-as-read on click; "Mark all as read" button.

*Settings Page:*
- Page header: "Settings" + subtitle.
- Left column: "Workshop profile" form (Workshop name, Address, Phone, Working hours) using `react-hook-form` + "Save Changes" button.
- Right column: "Preferences" toggles — Accept online bookings (off), Show prices to customers (on), Auto-send service updates (on), Email daily summary (on).
- Toggles update `SettingsContext` immediately; form save updates workshop profile.
- Pull from `SettingsContext` and `NotificationsContext`.

---

### Phase 10 — Polish, QA, Responsive & Bilingual Testing
**Day 10**

**Ahmed — Responsive & Accessibility Pass**
- Test every page at 320px / 768px / 1024px / 1440px / 1920px.
- Fix layout: tables scroll horizontally on mobile (or card-list), Kanban stacks vertically on mobile, stat grids collapse 4→2→1.
- Add loading skeletons, empty states, error states with retry on every page.
- Accessibility pass: keyboard nav, focus rings, modal/drawer focus trap, alt text, ARIA on dynamic content, form label associations.
- Run Lighthouse on every page; target ≥90 Accessibility + Best Practices.
- Fix all console warnings (React keys, prop types).
- Verify lazy-loaded routes load without flicker.

**Mohamed — Bilingual QA & Final Polish**
- Complete AR translations for every namespace.
- Verify AR quality (no machine-translation artifacts, correct pluralization, automotive terminology).
- Test every page in RTL: sidebar right, table columns right-to-left, charts mirrored (Recharts `reversed`/`orientation`), modals/drawers slide from left, directional icons mirrored, no hardcoded `ml-`/`mr-` leaks.
- Performance: lazy-load Recharts + dnd-kit, memoize list renders, verify bundle with `rollup-plugin-visualizer`.
- Global search in Topbar (command-palette dropdown searching bookings + customers + vehicles — basic version).
- Final design polish: spacing consistency, hover states, transitions, micro-interactions.
- Write `README.md`: how to run, switch languages, add new pages, where mock data lives, how to swap to a real API.

---

## Phase Summary

| Phase | Day | Ahmed                                            | Mohamed                                              | Pages Delivered                       |
| ----- | --- | ------------------------------------------------ | ---------------------------------------------------- | ------------------------------------- |
| 1     | 1   | Vite + Tailwind + tooling + folder structure     | Design tokens + UI primitives + `/dev` showcase      | (foundation)                          |
| 2     | 2   | Router + AppLayout + AuthContext + Login         | i18n setup + LanguageContext + RTL switching         | (shell)                               |
| 3     | 3   | Sidebar + ProPlanCard + navItems                 | Topbar + 12 mock datasets + Context providers        | (shell)                               |
| 4     | 4   | Dashboard page composition                       | Shared widgets + RevenueBarChart                     | Dashboard Overview                    |
| 5     | 5   | Bookings page                                    | Revenue Analytics page + comparison chart            | Bookings, Revenue Analytics           |
| 6     | 6   | Jobs Board (Kanban, 4 cols, DnD)                 | Repair Jobs Board (Kanban, 3 cols, DnD)              | Jobs Board, Repair Jobs Board         |
| 7     | 7   | Vehicles page (table/grid toggle)                | Technicians page (cards + drawer)                    | Vehicles, Technicians                 |
| 8     | 8   | Quotes page (multi-step modal)                   | Customers + Services & Pricing pages                 | Quotes, Customers, Services & Pricing |
| 9     | 9   | Reviews page (reply flow + rating chart)         | Notifications + Settings pages                       | Reviews, Notifications, Settings      |
| 10    | 10  | Responsive + a11y + Lighthouse ≥90               | AR/RTL QA + performance + README                     | (polish)                              |

**Total pages delivered: 13 + Login + 404.**
