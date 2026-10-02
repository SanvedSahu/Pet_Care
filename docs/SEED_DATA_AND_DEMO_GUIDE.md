# PetCare - Seed Data Catalog & 22-Step Demo Guide

This document catalogs the pre-seeded platform accounts, demo fixtures, and the step-by-step verification script required to test the complete application lifecycle.

---

## 1. Demo Credentials Catalog

The platform seeder (`server/seed/seeder.js`) populates the following accounts:

### 1.1 Master Administrator
| Role | Email | Password | Name | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@petcare.com` | `Admin@123` | System Administrator | Full Platform Governance |

### 1.2 Pet Owners
| Role | Email | Password | Name | Initial Pets Seeded |
| :--- | :--- | :--- | :--- | :--- |
| **PET_OWNER** | `sarah@example.com` | `Owner@123` | Sarah Jenkins | Max (Dog), Bella (Cat) |
| **PET_OWNER** | `michael@example.com` | `Owner@123` | Michael Chang | Luna (Rabbit), Milo (Dog) |

### 1.3 Service Providers (Veterinarians, Groomers, Trainers)

| Specialization | Email | Password | Name / Clinic | City | Initial Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Veterinarian** | `dr.sharma@petcare.com` | `Provider@123` | Dr. Rahul Sharma | Nagpur | **Approved** |
| **Veterinarian** | `dr.watson@petcare.com` | `Provider@123` | Dr. Emily Watson | Mumbai | **Pending** *(For admin approval test)* |
| **Pet Groomer** | `oliver@petcare.com` | `Provider@123` | Oliver Twist Grooming | Mumbai | **Approved** |
| **Pet Groomer** | `chloe@petcare.com` | `Provider@123` | Chloe Fluff Studio | Pune | **Approved** |
| **Pet Trainer** | `alex@petcare.com` | `Provider@123` | Alex Canine Academy | Bangalore | **Approved** |
| **Pet Trainer** | `david@petcare.com` | `Provider@123` | David Paws Training | Delhi | **Suspended** *(Testing market exclusion)* |

---

## 2. Sample Services Catalog

| Provider | Service Name | Category | Duration | Price | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Dr. Rahul Sharma** | General Checkup | Veterinary | 30 mins | ₹500 | Physical inspection, heart & lung auscultation, temperature, ear & eye exam. |
| **Dr. Rahul Sharma** | Vaccination & Shots | Veterinary | 25 mins | ₹850 | Core immunization for rabies, distemper, parvovirus, and hepatitis. |
| **Dr. Rahul Sharma** | Pet Consultation | Veterinary | 45 mins | ₹600 | In-depth nutritional, dietary, or behavioral medical evaluation. |
| **Dr. Rahul Sharma** | Dental Checkup | Veterinary | 30 mins | ₹700 | Plaque and tartar inspection, gum health check, dental cleaning advice. |
| **Dr. Emily Watson** | Puppy Immunization | Veterinary | 30 mins | ₹900 | Complete puppy starter vaccine course and deworming. |
| **Oliver Grooming** | Bath & Blow Dry | Grooming | 45 mins | ₹750 | Hypoallergenic medicated bath, blow dry, ear cleaning, and paw pad balm. |
| **Oliver Grooming** | Full Breed Grooming | Grooming | 75 mins | ₹1,400 | Complete haircut, shampoo, conditioning, nail clipping, and sanitary trim. |
| **Oliver Grooming** | Nail Trimming & Buff | Grooming | 20 mins | ₹300 | Stress-free claw trimming and smooth electric nail buffering. |
| **Chloe Fluff Studio**| Basic Grooming | Grooming | 40 mins | ₹650 | Brushing, ear cleaning, nail trim, and refreshing pet cologne mist. |
| **Alex Canine** | Basic Obedience | Training | 60 mins | ₹1,200 | Sit, stay, heel, recall, and impulse control techniques. |
| **Alex Canine** | Puppy Socialization | Training | 60 mins | ₹1,000 | Leash walking, environmental exposure, and anti-chewing conditioning. |
| **Alex Canine** | Behavior Correction | Training | 90 mins | ₹1,800 | Desensitization for aggression, separation anxiety, or excessive barking. |

---

## 3. Sample Pets Catalog

| Pet Name | Species | Breed | Age | Weight | Vaccination | Owner |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- |
| **Max** | Dog | Golden Retriever | 3 yrs | 28.5 kg | Up to Date | Sarah Jenkins |
| **Bella** | Cat | Persian | 2 yrs | 4.2 kg | Up to Date | Sarah Jenkins |
| **Luna** | Rabbit | Holland Lop | 1 yr | 1.8 kg | Up to Date | Michael Chang |
| **Milo** | Dog | French Bulldog | 4 yrs | 12.0 kg | Up to Date | Michael Chang |

---

## 4. 22-Step End-to-End Live Demonstration Script

Follow this script to verify the entire system end-to-end:

| Step # | Action Description | Target Role / URL | Expected Visual / Behavioral Result |
| :---: | :--- | :--- | :--- |
| **1** | Start MongoDB instance | Local mongod or Atlas | MongoDB connects on `localhost:27017` or URI. |
| **2** | Start Express Backend | `cd server && npm run dev` | Server logs: `"Server running on port 5000"`, `"Connected to MongoDB"`. |
| **3** | Start Vite Client | `cd client && npm run dev` | Client runs on `http://localhost:5173`. Landing page loads cleanly. |
| **4** | Login as Platform Admin | `http://localhost:5173/login` | Log in with `admin@petcare.com` / `Admin@123`. |
| **5** | View Admin Dashboard | `/admin/dashboard` | Dashboard displays metric cards (Users, Providers, Pets, Appointments). |
| **6** | Navigate to Providers List | `/admin/providers` | Table lists all providers with status badges. `Dr. Emily Watson` is **Pending**. |
| **7** | Approve Provider | `/admin/providers` | Click **Approve** on Dr. Emily Watson. Status updates to **Approved** badge. |
| **8** | Logout & Login as Pet Owner | `/login` | Log in with `sarah@example.com` / `Owner@123`. |
| **9** | Add a New Pet | `/owner/pets` &rarr; Click `+ Add Pet` | Add Beagle named `"Rocky"`, age `1`, weight `9.5 kg`. Appears in Pet list. |
| **10** | Open Find Services Marketplace | `/marketplace` | Marketplace displays verified providers. Dr. Emily Watson now appears. |
| **11** | Search & Filter Providers | `/marketplace` | Filter by `"Veterinarian"` or type `"Sharma"` in the search input. |
| **12** | Open Provider Profile | Click Dr. Rahul Sharma card | Profile displays bio, clinic in Nagpur, rating 4.9, and services list. |
| **13** | Select Service to Book | Click `Book Appointment` | Booking modal opens. Select `"General Checkup"` (₹500). |
| **14** | Select Pet | Booking modal | Select `"Max"` or newly created `"Rocky"`. |
| **15** | Select Date & Time Slot | Booking modal | Pick a future date (e.g. Oct 15) and time slot `10:30 AM`. |
| **16** | Confirm Appointment | Click `Confirm Booking` | Toast: `"Appointment booked successfully"`. Redirects to `/owner/appointments`. Status is **Pending**. |
| **17** | Login as Service Provider | `/login` | Log in with `dr.sharma@petcare.com` / `Provider@123`. |
| **18** | Confirm Appointment | `/provider/appointments` | Provider sees appointment for Max. Provider clicks **Accept / Confirm**. Badge becomes **Confirmed**. |
| **19** | Pet Owner Views Confirmation | `/owner/appointments` | Log back in as Sarah Jenkins. Appointment badge has updated to **Confirmed**; in-app notification received. |
| **20** | Provider Completes Service | `/provider/appointments` | Provider clicks **Mark Completed**. Status updates to **Completed**. |
| **21** | Pet Owner Views Completed Appt | `/owner/appointments` | Sarah Jenkins sees appointment moved to `"Completed"` tab with final price. |
| **22** | Admin Audits Platform Bookings | `/admin/appointments` | Admin logs in and verifies the completed appointment record in platform audit table. |
