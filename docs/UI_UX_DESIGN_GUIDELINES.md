# PetCare - UI/UX Design System & Layout Guidelines

This document outlines the visual design language, Tailwind CSS color tokens, responsive layout rules, status indicator standards, and component wireframes for the **PetCare Web Application**.

---

## 1. Visual Aesthetics & Design Principles

The PetCare interface is engineered to feel **approachable, modern, friendly, and clinical-grade**:

- **Compassionate & Welcoming**: Friendly pet imagery, rounded contours (`rounded-2xl`, `rounded-xl`), and warm accents create an immediate emotional bond with pet parents.
- **Clinical Trust & Credibility**: Emerald and teal primary hues signify medical hygiene, vet care, and dependability.
- **Zero Clutter**: Clean whitespace, subtle borders (`border-slate-200`), and soft shadows (`shadow-sm`, `shadow-md`) highlight critical information like appointments, prices, and status badges.
- **High Responsiveness**: Mobile-first grid layouts effortlessly adapt from 375px smartphones to 4K desktop displays.

---

## 2. Color Palette & Tailwind Tokens

```text
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Primary Emerald │ │ Secondary Amber │ │  Neutral Slate  │
│  #059669 (600)  │ │  #d97706 (600)  │ │  #0f172a (900)  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

| Token Role | Tailwind Class | Hex Code | Purpose / Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `emerald-600` | `#059669` | Primary CTA buttons, active tabs, brand logo, highlights |
| **Primary Hover** | `emerald-700` | `#047857` | Button hover and pressed states |
| **Primary Subtle**| `emerald-50` | `#ecfdf5` | Card backgrounds, active navigation item pill |
| **Secondary** | `amber-500` | `#f59e0b` | Star ratings, badges, warm accents, warning alerts |
| **Background** | `slate-50` | `#f8fafc` | Global app page background |
| **Surface** | `white` | `#ffffff` | Modals, table rows, cards, input backgrounds |
| **Text Primary** | `slate-900` | `#0f172a` | High-contrast headings and body copy |
| **Text Secondary**| `slate-600` | `#475569` | Subtitles, labels, timestamps, metadata |
| **Border** | `slate-200` | `#e2e8f0` | Dividers, card strokes, input borders |

### Status Badge Standard Palette

Every appointment and provider status utilizes uniform badge styling:

| Status | Badge Classes | Preview Appearance |
| :--- | :--- | :--- |
| **`Pending`** | `bg-amber-100 text-amber-800 border border-amber-300` | 🟡 Amber Pill |
| **`Confirmed`** | `bg-blue-100 text-blue-800 border border-blue-300` | 🔵 Blue Pill |
| **`Completed`** | `bg-emerald-100 text-emerald-800 border border-emerald-300` | 🟢 Green Pill |
| **`Cancelled`** | `bg-rose-100 text-rose-800 border border-rose-300` | 🔴 Rose Red Pill |
| **`Rejected`** | `bg-red-100 text-red-800 border border-red-300` | 🔴 Red Pill |
| **`Suspended`** | `bg-slate-200 text-slate-700 border border-slate-400` | ⚪ Slate Pill |

---

## 3. Responsive Breakpoints & Adaptations

| Screen Size | Breakpoint | Responsive Behavior |
| :--- | :--- | :--- |
| **Mobile** | `< 768px` | Top navbar collapses into hamburger menu; cards stack in single column; tables become horizontally scrollable cards; booking steps become vertical. |
| **Tablet** | `768px - 1024px` | 2-column card grid; condensed dashboard sidebar; search bar spans full width above filters. |
| **Desktop** | `> 1024px` | 3-column marketplace grid; permanent fixed dashboard sidebar; 4-card metric header rows. |

---

## 4. Key Page Layouts & Wireframes

### 4.1 Public Landing Page (`HomePage.jsx`)

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [LOGO] PetCare        Find Services   About Us   [Login] [Get Started] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   🐾 Complete Care for Your Beloved Pets                               │
│   Find certified veterinarians, professional groomers, and trainers    │
│                                                                        │
│   [🔍 Search by Provider or Service...] [All Categories ▾] [Search]    │
│                                                                        │
│   [Find Services Button]    [Register as Provider]                     │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│   POPULAR SERVICES                                                     │
│   ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────┐   │
│   │  Veterinarian    │  │   Pet Groomer    │  │   Pet Trainer      │   │
│   │  Checkups & Care │  │   Baths & Styling│  │   Obedience & Pups │   │
│   └──────────────────┘  └──────────────────┘  └────────────────────┘   │
├────────────────────────────────────────────────────────────────────────┤
│   HOW IT WORKS                                                         │
│   [1. Create Account] ➔ [2. Add Pet] ➔ [3. Find Provider] ➔ [4. Book]  │
├────────────────────────────────────────────────────────────────────────┤
│   FEATURED VERIFIED PROVIDERS                                          │
│   ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────┐   │
│   │ Dr. Rahul Sharma │  │ Oliver Twist     │  │ Alex Canine        │   │
│   │ Vet ★ 4.9 (Nagpur│  │ Groomer ★ 4.8    │  │ Trainer ★ 4.9      │   │
│   │ From ₹500        │  │ From ₹750        │  │ From ₹1,200        │   │
│   │ [Book Now]       │  │ [Book Now]       │  │ [Book Now]         │   │
│   └──────────────────┘  └──────────────────┘  └────────────────────┘   │
├────────────────────────────────────────────────────────────────────────┤
│   FOOTER: Quick Links • Legal • Contact • © 2026 PetCare Inc.          │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 4.2 Service Marketplace (`MarketplacePage.jsx`)

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Header & Search Bar: [ 🔍 Search name or service... ] [ City Filter ▾] │
├────────────────────────┬───────────────────────────────────────────────┤
│ FILTERS                │ RESULTS (Showing 6 Verified Providers)        │
│                        │                                               │
│ Category:              │ ┌───────────────────────────────────────────┐ │
│ [x] All Providers      │ │ [IMG] Dr. Rahul Sharma     ★ 4.9 (42 rev) │ │
│ [ ] Veterinarians      │ │ Veterinarian • 5 yrs exp • Nagpur         │ │
│ [ ] Pet Groomers       │ │ Services: Checkup, Vaccine, Dental        │ │
│ [ ] Pet Trainers       │ │ Starts from: ₹500    [View Profile] [Book]│ │
│                        │ └───────────────────────────────────────────┘ │
│ Max Price: [────●────] │ ┌───────────────────────────────────────────┐ │
│                        │ │ [IMG] Oliver Twist Grooming ★ 4.8 (29 rev)│ │
│ Min Rating: [ 4★ & up ]│ │ Pet Groomer • 4 yrs exp • Mumbai          │ │
│                        │ │ Starts from: ₹750    [View Profile] [Book]│ │
│                        │ └───────────────────────────────────────────┘ │
└────────────────────────┴───────────────────────────────────────────────┘
```

---

### 4.3 Step-by-Step Booking Wizard Modal

```text
┌──────────────────────────────────────────────────────────────┐
│ Book Appointment with Dr. Rahul Sharma                   [X] │
├──────────────────────────────────────────────────────────────┤
│  STEP 1: Select Service                                      │
│  (●) General Checkup - ₹500 (30 mins)                        │
│  ( ) Vaccination - ₹850 (25 mins)                            │
│  ( ) Pet Dental Consultation - ₹600 (30 mins)                │
│                                                              │
│  STEP 2: Choose Your Pet                                     │
│  (●) Max (Golden Retriever - Dog)   ( ) Bella (Persian - Cat)│
│                                                              │
│  STEP 3: Select Date & Time Slot                             │
│  Date: [ 2026-10-15 📅 ]                                     │
│  [09:00 AM]  [09:45 AM (Booked)]  [● 10:30 AM]  [11:15 AM]   │
│  [01:30 PM]  [02:15 PM]           [03:00 PM]    [04:30 PM]   │
│                                                              │
│  STEP 4: Notes / Reason                                      │
│  [ Annual rabies vaccination and health certificate...     ] │
│                                                              │
│  Total Locked Price: ₹500                                    │
│  [Cancel]                               [Confirm Booking ➔]  │
└──────────────────────────────────────────────────────────────┘
```

---

### 4.4 Dashboard Layout (Owner, Provider, Admin)

```text
┌──────────────┬─────────────────────────────────────────────────────────┐
│ [PetCare]    │ [🔔 Notifications (3)]       Sarah Jenkins [Avatar ▾]   │
├──────────────┼─────────────────────────────────────────────────────────┤
│ 📊 Dashboard │ Welcome back, Sarah!                                    │
│ 🐾 My Pets   │ ┌───────────────┐ ┌───────────────┐ ┌─────────────────┐ │
│ 🔍 Find Vets │ │ 2 Active Pets │ │ 1 Upcoming App│ │ 4 Completed App │ │
│ 📅 My Appts  │ └───────────────┘ └───────────────┘ └─────────────────┘ │
│ 👤 Profile   │                                                         │
│ 🚪 Logout    │ Upcoming Appointments:                                  │
│              │ ┌─────────────────────────────────────────────────────┐ │
│              │ │ Dr. Rahul Sharma • Max • Oct 15, 10:30 AM           │ │
│              │ │ Service: General Checkup • ₹500 • [ Confirmed ]     │ │
│              │ │ [View Details] [Cancel Appointment]                 │ │
│              │ └─────────────────────────────────────────────────────┘ │
└──────────────┴─────────────────────────────────────────────────────────┘
```

---

## 5. Micro-Interactions, Feedback & Empty States

### 5.1 Toast Notification Standard
- **Success Toast**: Emerald left-border with checkmark icon (`"Appointment booked successfully!"`).
- **Error Toast**: Rose left-border with alert-circle icon (`"This time slot was just taken. Please choose another."`).
- **Duration**: Auto-dismiss after 4.5 seconds with pause-on-hover.

### 5.2 Empty State Standards
When lists contain zero records, clean actionable empty states must render:
- **No Pets**: Friendly dog outline illustration + `"You haven't added any pets yet."` + `[+ Add Your First Pet]` button.
- **No Appointments**: Calendar icon + `"No upcoming appointments."` + `[Find Services & Book Now]` button.
- **No Providers Matching Filter**: Search icon + `"No service providers found in this city."` + `[Clear Filters]` button.
