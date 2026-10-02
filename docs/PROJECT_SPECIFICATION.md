# PetCare - Detailed Project Specification & Requirements

This document provides the formal requirements and functional specifications for the **PetCare Management & Service Booking Platform**.

---

## 1. Executive Summary & Objective

The primary objective of PetCare is to build a robust, production-style, role-based platform connecting pet owners with verified service providers (**Veterinarians**, **Pet Groomers**, and **Pet Trainers**).

The application emphasizes:
- **Clean modularity**: Clear separation of concerns between client and server.
- **Enterprise-grade security**: Server-side role-based access control (RBAC), strict ownership verification, and authoritative price resolution.
- **Realistic workflows**: Comprehensive lifecycle management for pets, provider vetting, service catalogs, appointment booking, and in-app notifications.

---

## 2. User Roles & Capabilities Matrix

The system supports three primary user roles:
1. `PET_OWNER`
2. `SERVICE_PROVIDER`
3. `ADMIN`

Service providers have a secondary specialization dimension:
- `VETERINARIAN`
- `PET_GROOMER`
- `PET_TRAINER`

### Role-Based Capability Matrix

| Feature / Action | Pet Owner | Service Provider | Administrator | Public Visitor |
| :--- | :---: | :---: | :---: | :---: |
| **View Landing Page & About** | ✅ | ✅ | ✅ | ✅ |
| **Browse Public Marketplace** | ✅ | ✅ | ✅ | ✅ |
| **View Provider Profiles & Services**| ✅ | ✅ | ✅ | ✅ |
| **User Registration & Login** | ✅ | ✅ | Pre-seeded | ✅ |
| **Manage Profile Details** | ✅ | ✅ | ✅ | ❌ |
| **Change Password** | ✅ | ✅ | ✅ | ❌ |
| **Add / Edit / Delete Pets** | ✅ | ❌ | ❌ | ❌ |
| **View Pet Medical Records** | Personal | In Appt Context | View All | ❌ |
| **Book Appointments** | ✅ | ❌ | ❌ | ❌ |
| **Cancel Appointments** | Pending/Confirmed | ❌ | Any | ❌ |
| **Manage Service Catalog** | ❌ | ✅ | View All | ❌ |
| **Accept / Reject Bookings** | ❌ | ✅ | ❌ | ❌ |
| **Mark Booking Completed** | ❌ | ✅ | ✅ | ❌ |
| **Provider Approval / Rejection** | ❌ | ❌ | ✅ | ❌ |
| **Provider Suspension / Reactivate**| ❌ | ❌ | ✅ | ❌ |
| **Enable / Disable Users** | ❌ | ❌ | ✅ | ❌ |
| **Platform Metric Dashboard** | ❌ | ❌ | ✅ | ❌ |
| **Receive In-App Notifications** | ✅ | ✅ | ✅ | ❌ |

---

## 3. User Stories & Functional Workflows

### 3.1 Pet Owner User Stories
- **US-O1 (Authentication)**: As a pet owner, I want to register with my name, email, phone, and secure password so that I can manage my pets and book services.
- **US-O2 (Pet Portfolio)**: As a pet owner, I want to add my pets with species, breed, age, weight, vaccination status, and medical history so providers have necessary context during care.
- **US-O3 (Discovery & Filtering)**: As a pet owner, I want to search and filter service providers by category (Vet, Groomer, Trainer), location, and service name so I can find local care.
- **US-O4 (Provider Profile Inspection)**: As a pet owner, I want to view a provider's credentials, experience, bio, services, and pricing before booking.
- **US-O5 (Service Booking)**: As a pet owner, I want to select a provider, service, my pet, appointment date, and available time slot to book an appointment.
- **US-O6 (Appointment Tracking)**: As a pet owner, I want to view my appointments filtered by Upcoming, Completed, and Cancelled tabs.
- **US-O7 (Appointment Cancellation)**: As a pet owner, I want to cancel a pending or confirmed appointment if my schedule changes.
- **US-O8 (Notifications)**: As a pet owner, I want to see notification badges when my booking is confirmed or updated by the provider.

### 3.2 Service Provider User Stories
- **US-P1 (Onboarding)**: As a service provider, I want to register with my profession (Veterinarian, Groomer, Trainer), specialization, experience, and qualification so the admin can review my credentials.
- **US-P2 (Profile Completeness)**: As a service provider, I want to edit my bio, location, contact information, and profile photo to present a trustworthy service.
- **US-P3 (Service Catalog CRUD)**: As a service provider, I want to add, edit, toggle, or delete services with custom names, descriptions, durations, and prices.
- **US-P4 (Appointment Lifecycle Management)**: As a service provider, I want to view appointments scheduled with me and accept or reject pending requests.
- **US-P5 (Service Fulfillment)**: As a service provider, I want to mark confirmed appointments as `Completed` after delivering the service.
- **US-P6 (Operational Dashboard)**: As a service provider, I want to view high-level counts of total, pending, upcoming, and completed appointments.

### 3.3 Platform Administrator User Stories
- **US-A1 (Governance Dashboard)**: As an administrator, I want to view real-time platform statistics (total users, owners, providers, pending approvals, pets, and appointments).
- **US-A2 (Provider Verification Queue)**: As an administrator, I want to review pending provider registrations and approve or reject them based on credentials.
- **US-A3 (Provider Discipline)**: As an administrator, I want to suspend non-compliant providers so they cannot receive bookings or appear publicly.
- **US-A4 (User Moderation)**: As an administrator, I want to activate or deactivate user accounts to maintain community safety.
- **US-A5 (Appointment Oversight)**: As an administrator, I want to inspect all appointments across the system and override statuses if needed.

---

## 4. Business Rules & Enforcement Mechanics

### 4.1 Authentication & Security Rules
1. **Password Hashing**: Passwords must be hashed using `bcrypt` (10 salt rounds) before database storage. Plaintext passwords must never be stored, logged, or returned in API responses.
2. **JWT Stateless Authentication**: User identity is encapsulated in signed JSON Web Tokens (JWT) containing `id`, `role`, and `email` with a 7-day expiration.
3. **Defense-in-Depth Authorization**: The backend independently validates token existence, user active status (`isActive === true`), and user role on every protected route. Frontend visual guards are never relied upon for security.

### 4.2 Pet Management Rules
1. **Ownership Isolation**: A pet owner can only access, edit, or delete pets associated with their own `owner` ID.
2. **Species Support**: The platform supports `Dog`, `Cat`, `Bird`, `Rabbit`, and `Other`.
3. **Mandatory Metadata**: A pet must have a name, species, gender, and age. Weight must be a positive number.

### 4.3 Service Provider & Approval Rules
1. **Gated Visibility**: A provider profile has one of four statuses: `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`.
2. **Marketplace Exclusion**: Only `APPROVED` providers are indexed and rendered in the public service marketplace.
3. **Booking Ineligibility**: Providers whose status is not `APPROVED` cannot receive new appointments.

### 4.4 Service Catalog Rules
1. **Ownership Linkage**: A service provider can only modify or delete services that link to their own provider ID.
2. **Catalog Integrity**: Price must be greater than or equal to 0; duration must be a positive integer in minutes.

### 4.5 Appointment Booking & Price Integrity Rules
1. **Authoritative Server Pricing**: The frontend client sends only `serviceId`. The backend retrieves the authoritative price directly from the `Service` model in MongoDB. Client-submitted prices are rejected.
2. **No Double Booking**: A provider cannot be booked for overlapping time slots on the same date.
3. **No Past Appointments**: The backend validates that `date + time` is strictly in the future.
4. **State Machine Transitions**:
   - `PENDING` &rarr; `CONFIRMED` (Provider action)
   - `PENDING` &rarr; `REJECTED` (Provider action)
   - `PENDING` &rarr; `CANCELLED` (Owner or Admin action)
   - `CONFIRMED` &rarr; `COMPLETED` (Provider or Admin action)
   - `CONFIRMED` &rarr; `CANCELLED` (Owner or Admin action)
   - `COMPLETED`, `CANCELLED`, `REJECTED` are terminal states and cannot be modified.

---

## 5. Non-Functional Requirements

### 5.1 Performance & Responsiveness
- **API Response Time**: Read operations should complete in under 200ms; write operations under 350ms.
- **Client Bundle Size**: Optimized with Vite code splitting and tree-shaking.
- **Device Support**: Fluid responsive layout across Mobile (375px+), Tablet (768px+), and Desktop (1024px+).

### 5.2 Accessibility & Usability
- Semantic HTML5 structure (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`).
- Standardized color contrast for accessibility (WCAG AA compliant).
- Descriptive empty states, loading skeletons, and interactive toast feedback for all user actions.

### 5.3 Reliability & Error Handling
- Consistent standard JSON response envelopes across all endpoints.
- No unhandled Promise rejections; global Express error middleware catches all exceptions.
- Database connection resiliency with automated reconnect logic.

---

## 6. Scope Boundaries & Excluded Features

To maintain clarity, architectural elegance, and reliable execution for academic demonstration, the following features are **explicitly out of scope**:
- ❌ Online payment gateways (Stripe, Razorpay, PayPal)
- ❌ In-app wallet and escrow mechanisms
- ❌ Live video conferencing / WebRTC
- ❌ Real-time instant messaging / chat sockets
- ❌ AI-based diagnostic scanners or computer vision diagnosis
- ❌ Live GPS pet tracking
- ❌ SMS gateways (Twilio) and external SMTP email integrations (in-app notifications are used instead)
- ❌ Social OAuth login (Google, Facebook)
- ❌ Microservices and message queues (Docker, Kafka, RabbitMQ)
