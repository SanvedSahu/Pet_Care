# PetCare - REST API Documentation & Contracts

This document provides complete, contract-level specifications for all REST endpoints across the **PetCare Backend API**.

---

## 1. Global Conventions & Standards

- **Base URL**: `http://localhost:5000/api`
- **Data Format**: `application/json` (UTF-8)
- **Authentication**: JWT Bearer token passed in HTTP Header:
  ```http
  Authorization: Bearer <your_jwt_token_here>
  ```

### Standard Response Wrappers

#### Success Response Envelope (HTTP 200 / 201)
```json
{
  "success": true,
  "message": "Resource retrieved / operation successful",
  "data": {}
}
```

#### Error Response Envelope (HTTP 4xx / 5xx)
```json
{
  "success": false,
  "message": "Descriptive reason for failure",
  "errors": []
}
```

---

## 2. Authentication Endpoints (`/api/auth`)

### 2.1 Register User (Pet Owner or Provider)
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Description**: Registers a new user account. If `role` is `SERVICE_PROVIDER`, automatically initializes a linked `ProviderProfile` in `Pending` state.

#### Request Body (Pet Owner Registration):
```json
{
  "name": "Sarah Jenkins",
  "email": "sarah@example.com",
  "phone": "+91 98765 43210",
  "password": "Owner@123",
  "confirmPassword": "Owner@123",
  "role": "PET_OWNER"
}
```

#### Request Body (Service Provider Registration):
```json
{
  "name": "Dr. Rahul Sharma",
  "email": "dr.sharma@petcare.com",
  "phone": "+91 98230 11223",
  "password": "Provider@123",
  "confirmPassword": "Provider@123",
  "role": "SERVICE_PROVIDER",
  "providerType": "Veterinarian",
  "specialization": "Small Animal Surgery & Routine Care",
  "experience": 5,
  "qualification": "BVSc & AH, MVSc (Surgery)",
  "location": "Nagpur",
  "bio": "Compassionate veterinarian dedicated to clinical care and preventive medicine."
}
```

#### Successful Response (`201 Created`):
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "651a1b2c3d4e5f6a7b8c9d01",
      "name": "Sarah Jenkins",
      "email": "sarah@example.com",
      "phone": "+91 98765 43210",
      "role": "PET_OWNER",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2.2 Login User
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Description**: Authenticates email and password, verifies account is active, and returns a signed JWT.

#### Request Body:
```json
{
  "email": "admin@petcare.com",
  "password": "Admin@123"
}
```

#### Successful Response (`200 OK`):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "651a1b2c3d4e5f6a7b8c9000",
      "name": "System Administrator",
      "email": "admin@petcare.com",
      "role": "ADMIN",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2.3 Get Current User Profile
- **Endpoint**: `GET /api/auth/me`
- **Access**: Authenticated (All Roles)
- **Description**: Returns profile details for the user associated with the token.

#### Successful Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "_id": "651a1b2c3d4e5f6a7b8c9d01",
    "name": "Sarah Jenkins",
    "email": "sarah@example.com",
    "phone": "+91 98765 43210",
    "role": "PET_OWNER"
  }
}
```

---

### 2.4 Update Profile
- **Endpoint**: `PUT /api/auth/profile`
- **Access**: Authenticated (All Roles)
- **Request Body**:
```json
{
  "name": "Sarah Jenkins-Miller",
  "phone": "+91 98765 99999"
}
```

---

### 2.5 Change Password
- **Endpoint**: `PUT /api/auth/change-password`
- **Access**: Authenticated (All Roles)
- **Request Body**:
```json
{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@123"
}
```

---

## 3. Pet Management Endpoints (`/api/pets`)

### 3.1 Get All Pets for Logged-In Owner
- **Endpoint**: `GET /api/pets`
- **Access**: `PET_OWNER`
- **Response**: List of pets owned by current user.

```json
{
  "success": true,
  "data": [
    {
      "_id": "651a2b3c4d5e6f7a8b9c001",
      "name": "Max",
      "species": "Dog",
      "breed": "Golden Retriever",
      "gender": "Male",
      "age": 3,
      "weight": 28.5,
      "medicalNotes": "Allergic to chicken proteins.",
      "vaccinationStatus": "Up to Date",
      "image": "https://images.unsplash.com/photo-1552053831-71594a27632d"
    }
  ]
}
```

---

### 3.2 Add Pet
- **Endpoint**: `POST /api/pets`
- **Access**: `PET_OWNER`
- **Request Body**:
```json
{
  "name": "Bella",
  "species": "Cat",
  "breed": "Persian",
  "gender": "Female",
  "age": 2,
  "weight": 4.2,
  "medicalNotes": "Sensitive digestion; prefers dry food.",
  "vaccinationStatus": "Up to Date"
}
```

---

### 3.3 Update Pet
- **Endpoint**: `PUT /api/pets/:id`
- **Access**: `PET_OWNER` (Enforces ownership verification)

---

### 3.4 Delete Pet
- **Endpoint**: `DELETE /api/pets/:id`
- **Access**: `PET_OWNER` (Enforces ownership verification)

---

## 4. Service Provider Endpoints (`/api/providers`)

### 4.1 Browse Public Marketplace
- **Endpoint**: `GET /api/providers`
- **Access**: Public
- **Query Parameters**:
  - `type`: `Veterinarian` | `Pet Groomer` | `Pet Trainer`
  - `location`: string (e.g. `Nagpur`, `Mumbai`)
  - `search`: string (Provider name or keyword)
  - `minRating`: number (e.g. `4.5`)

#### Successful Response (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "_id": "651a3b4c5d6e7f8a9b0c001",
      "user": {
        "_id": "651a1b2c3d4e5f6a7b8c9002",
        "name": "Dr. Rahul Sharma",
        "email": "dr.sharma@petcare.com",
        "phone": "+91 98230 11223"
      },
      "providerType": "Veterinarian",
      "specialization": "General Pet Care & Surgery",
      "experience": 5,
      "qualification": "BVSc & AH",
      "bio": "Experienced veterinary surgeon with over 5 years of clinical practice.",
      "location": "Nagpur",
      "approvalStatus": "Approved",
      "rating": 4.9,
      "services": [
        {
          "_id": "651a4b5c6d7e8f9a0b1c001",
          "name": "General Checkup",
          "price": 500,
          "duration": 30
        }
      ],
      "startingPrice": 500
    }
  ]
}
```

---

### 4.2 Get Detailed Provider Profile
- **Endpoint**: `GET /api/providers/:id`
- **Access**: Public
- **Description**: Returns detailed provider profile including their active service catalog.

---

### 4.3 Get My Provider Profile
- **Endpoint**: `GET /api/providers/me`
- **Access**: `SERVICE_PROVIDER`

---

### 4.4 Update My Provider Profile
- **Endpoint**: `PUT /api/providers/me`
- **Access**: `SERVICE_PROVIDER`
- **Request Body**:
```json
{
  "specialization": "Advanced Orthopedic Surgery & Small Animals",
  "bio": "Updated professional bio with 6+ years experience.",
  "location": "Nagpur - South Extension"
}
```

---

## 5. Service Catalog Endpoints (`/api/services`)

### 5.1 Get Services by Provider
- **Endpoint**: `GET /api/services?providerId=:providerId`
- **Access**: Public

---

### 5.2 Create Service
- **Endpoint**: `POST /api/services`
- **Access**: `SERVICE_PROVIDER`
- **Request Body**:
```json
{
  "name": "Vaccination & Immunization",
  "description": "Comprehensive immunization coverage including Rabies and DHPP.",
  "category": "Veterinary",
  "price": 850,
  "duration": 25
}
```

---

### 5.3 Update Service
- **Endpoint**: `PUT /api/services/:id`
- **Access**: `SERVICE_PROVIDER` (Enforces provider ownership)

---

### 5.4 Delete Service
- **Endpoint**: `DELETE /api/services/:id`
- **Access**: `SERVICE_PROVIDER` (Enforces provider ownership)

---

## 6. Appointment Booking Endpoints (`/api/appointments`)

### 6.1 Book Appointment
- **Endpoint**: `POST /api/appointments`
- **Access**: `PET_OWNER`
- **Validation**:
  - Validates provider exists and has `approvalStatus === 'Approved'`.
  - Validates pet belongs to the logged-in user.
  - Validates service belongs to provider.
  - Pulls authoritative price from `Service.price`.
  - Verifies date is not in the past and provider has no overlapping booking.

#### Request Body:
```json
{
  "providerId": "651a3b4c5d6e7f8a9b0c001",
  "serviceId": "651a4b5c6d7e8f9a0b1c001",
  "petId": "651a2b3c4d5e6f7a8b9c001",
  "date": "2026-10-15",
  "time": "10:30 AM",
  "reason": "Annual rabies booster vaccination and physical checkup."
}
```

#### Successful Response (`201 Created`):
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "_id": "651a5b6c7d8e9f0a1b2c001",
    "status": "Pending",
    "price": 500,
    "date": "2026-10-15T00:00:00.000Z",
    "time": "10:30 AM"
  }
}
```

---

### 6.2 Get Owner's Appointments
- **Endpoint**: `GET /api/appointments/my`
- **Access**: `PET_OWNER`
- **Query Parameters**: `status` (`Upcoming`, `Completed`, `Cancelled`)

---

### 6.3 Get Provider's Appointments
- **Endpoint**: `GET /api/appointments/provider`
- **Access**: `SERVICE_PROVIDER`

---

### 6.4 Update Appointment Status
- **Endpoint**: `PATCH /api/appointments/:id/status`
- **Access**: `SERVICE_PROVIDER`, `PET_OWNER`, `ADMIN`
- **Request Body**:
```json
{
  "status": "Confirmed"
}
```

---

## 7. Notification Endpoints (`/api/notifications`)

- `GET /api/notifications`: Returns user's in-app notifications.
- `PATCH /api/notifications/:id/read`: Marks a single notification as read.
- `PATCH /api/notifications/read-all`: Marks all notifications as read.

---

## 8. Administration Endpoints (`/api/admin`)
*All Admin endpoints require `authMiddleware` + `roleMiddleware(['ADMIN'])`.*

### 8.1 Executive Dashboard Metrics
- **Endpoint**: `GET /api/admin/dashboard`
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 28,
    "totalPetOwners": 20,
    "totalProviders": 7,
    "pendingProviders": 2,
    "approvedProviders": 4,
    "suspendedProviders": 1,
    "totalPets": 35,
    "totalAppointments": 42,
    "pendingAppointments": 6,
    "completedAppointments": 28
  }
}
```

### 8.2 Provider Approval Workflow
- `GET /api/admin/providers`: List all providers with filter (`status=Pending|Approved|Rejected|Suspended`).
- `PATCH /api/admin/providers/:id/approve`: Approves provider for public marketplace.
- `PATCH /api/admin/providers/:id/reject`: Rejects provider application.
- `PATCH /api/admin/providers/:id/suspend`: Suspends provider account.

### 8.3 User Governance
- `GET /api/admin/users`: List all platform users with role filter (`role=PET_OWNER|SERVICE_PROVIDER|ADMIN`).
- `PATCH /api/admin/users/:id/status`: Toggle user `isActive` flag (`{ "isActive": false }`).

### 8.4 Platform Appointments Oversight
- `GET /api/admin/appointments`: View all appointments across all providers and owners.
- `GET /api/admin/pets`: View all registered pets.
