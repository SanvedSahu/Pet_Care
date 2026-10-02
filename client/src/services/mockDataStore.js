/**
 * Fallback Seed Store matching docs/SEED_DATA_AND_DEMO_GUIDE.md
 * Persists in localStorage if backend is unreachable.
 */

const STORAGE_KEYS = {
  PETS: 'petcare_mock_pets',
  PROVIDERS: 'petcare_mock_providers',
  SERVICES: 'petcare_mock_services',
  APPOINTMENTS: 'petcare_mock_appointments',
  NOTIFICATIONS: 'petcare_mock_notifications',
};

// Initial Providers
const initialProviders = [
  {
    _id: 'prov_sharma',
    user: {
      _id: 'user_sharma',
      name: 'Dr. Rahul Sharma',
      email: 'dr.sharma@petcare.com',
      phone: '+91 98230 11223',
    },
    providerType: 'Veterinarian',
    specialization: 'General Pet Care, Internal Medicine & Surgery',
    experience: 5,
    qualification: 'BVSc & AH, MVSc (Surgery)',
    bio: 'Compassionate veterinarian dedicated to clinical care, preventative surgery, and compassionate treatment for dogs and cats.',
    location: 'Nagpur',
    approvalStatus: 'Approved',
    rating: 4.9,
    startingPrice: 500,
    services: [
      {
        _id: 'srv_checkup',
        provider: 'prov_sharma',
        name: 'General Checkup',
        category: 'Veterinary',
        duration: 30,
        price: 500,
        description: 'Physical examination, heart & lung auscultation, temperature, and ear & eye exam.',
        isActive: true,
      },
      {
        _id: 'srv_vaccine',
        provider: 'prov_sharma',
        name: 'Vaccination & Shots',
        category: 'Veterinary',
        duration: 25,
        price: 850,
        description: 'Core immunization for rabies, distemper, parvovirus, and canine hepatitis.',
        isActive: true,
      },
      {
        _id: 'srv_dental',
        provider: 'prov_sharma',
        name: 'Dental Checkup',
        category: 'Veterinary',
        duration: 30,
        price: 700,
        description: 'Plaque and tartar inspection, gum health check, dental cleaning advice.',
        isActive: true,
      },
      {
        _id: 'srv_consult',
        provider: 'prov_sharma',
        name: 'Dietary & Health Consultation',
        category: 'Veterinary',
        duration: 45,
        price: 600,
        description: 'In-depth nutritional, weight-management, or senior pet medical counseling.',
        isActive: true,
      },
    ],
  },
  {
    _id: 'prov_watson',
    user: {
      _id: 'user_watson',
      name: 'Dr. Emily Watson',
      email: 'dr.watson@petcare.com',
      phone: '+91 98230 44556',
    },
    providerType: 'Veterinarian',
    specialization: 'Feline Internal Medicine & Canine Wellness',
    experience: 3,
    qualification: 'BVSc & AH',
    bio: 'Dedicated clinical veterinarian with a passion for companion animal preventative health and feline dietary counseling.',
    location: 'Mumbai',
    approvalStatus: 'Pending',
    rating: 4.7,
    startingPrice: 900,
    services: [
      {
        _id: 'srv_puppy_imm',
        provider: 'prov_watson',
        name: 'Puppy Starter Immunization',
        category: 'Veterinary',
        duration: 30,
        price: 900,
        description: 'Complete puppy starter vaccine course, microchip scanning, and deworming.',
        isActive: true,
      },
    ],
  },
  {
    _id: 'prov_oliver',
    user: {
      _id: 'user_oliver',
      name: 'Oliver Twist Grooming',
      email: 'oliver@petcare.com',
      phone: '+91 98230 77889',
    },
    providerType: 'Pet Groomer',
    specialization: 'Breed Styling & De-shedding Treatments',
    experience: 4,
    qualification: 'Certified Master Pet Stylist (CMG)',
    bio: 'Specializing in fear-free handling and luxury spa grooming for dogs of all sizes and coat textures.',
    location: 'Mumbai',
    approvalStatus: 'Approved',
    rating: 4.8,
    startingPrice: 300,
    services: [
      {
        _id: 'srv_bath_blow',
        provider: 'prov_oliver',
        name: 'Bath & Blow Dry',
        category: 'Grooming',
        duration: 45,
        price: 750,
        description: 'Hypoallergenic medicated bath, blow dry, ear cleaning, and paw pad balm.',
        isActive: true,
      },
      {
        _id: 'srv_full_groom',
        provider: 'prov_oliver',
        name: 'Full Breed Grooming',
        category: 'Grooming',
        duration: 75,
        price: 1400,
        description: 'Complete haircut, shampoo, conditioning, nail clipping, and sanitary trim.',
        isActive: true,
      },
      {
        _id: 'srv_nail_trim',
        provider: 'prov_oliver',
        name: 'Nail Trimming & Buff',
        category: 'Grooming',
        duration: 20,
        price: 300,
        description: 'Stress-free claw trimming and smooth electric nail buffering.',
        isActive: true,
      },
    ],
  },
  {
    _id: 'prov_chloe',
    user: {
      _id: 'user_chloe',
      name: 'Chloe Fluff Studio',
      email: 'chloe@petcare.com',
      phone: '+91 98230 99001',
    },
    providerType: 'Pet Groomer',
    specialization: 'Show Dog Coat Preparation & Cat Grooming',
    experience: 6,
    qualification: 'Professional Grooming Diploma',
    bio: 'Gentle, modern grooming studio focused on stress-free baths, hygiene trims, and aesthetic show styling.',
    location: 'Pune',
    approvalStatus: 'Approved',
    rating: 4.8,
    startingPrice: 650,
    services: [
      {
        _id: 'srv_basic_groom',
        provider: 'prov_chloe',
        name: 'Basic Grooming & Spa',
        category: 'Grooming',
        duration: 40,
        price: 650,
        description: 'Brushing, ear cleaning, nail trim, and refreshing pet cologne mist.',
        isActive: true,
      },
    ],
  },
  {
    _id: 'prov_alex',
    user: {
      _id: 'user_alex',
      name: 'Alex Canine Academy',
      email: 'alex@petcare.com',
      phone: '+91 98230 33221',
    },
    providerType: 'Pet Trainer',
    specialization: 'Behavior Modification & Canine Agility',
    experience: 7,
    qualification: 'CPDT-KA Certified Professional Dog Trainer',
    bio: 'Science-based positive reinforcement dog trainer helping owners solve reactive behaviors and build lasting bonds.',
    location: 'Bangalore',
    approvalStatus: 'Approved',
    rating: 4.9,
    startingPrice: 1000,
    services: [
      {
        _id: 'srv_basic_obed',
        provider: 'prov_alex',
        name: 'Basic Obedience Training',
        category: 'Training',
        duration: 60,
        price: 1200,
        description: 'Sit, stay, heel, recall, and impulse control techniques with positive rewards.',
        isActive: true,
      },
      {
        _id: 'srv_pup_social',
        provider: 'prov_alex',
        name: 'Puppy Socialization Session',
        category: 'Training',
        duration: 60,
        price: 1000,
        description: 'Leash walking, environmental exposure, and anti-chewing conditioning.',
        isActive: true,
      },
      {
        _id: 'srv_behavior_corr',
        provider: 'prov_alex',
        name: 'Behavior Modification',
        category: 'Training',
        duration: 90,
        price: 1800,
        description: 'Desensitization for separation anxiety, noise phobias, or barrier aggression.',
        isActive: true,
      },
    ],
  },
];

// Initial Pets
const initialPets = [
  {
    _id: 'pet_max',
    ownerEmail: 'sarah@example.com',
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    gender: 'Male',
    age: 3,
    weight: 28.5,
    medicalNotes: 'Allergic to chicken proteins. Receives daily omega-3 supplements.',
    vaccinationStatus: 'Up to Date',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'pet_bella',
    ownerEmail: 'sarah@example.com',
    name: 'Bella',
    species: 'Cat',
    breed: 'Persian Longhair',
    gender: 'Female',
    age: 2,
    weight: 4.2,
    medicalNotes: 'Sensitive digestion; strictly on prescribed urinary gastro care food.',
    vaccinationStatus: 'Up to Date',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'pet_luna',
    ownerEmail: 'michael@example.com',
    name: 'Luna',
    species: 'Rabbit',
    breed: 'Holland Lop',
    gender: 'Female',
    age: 1,
    weight: 1.8,
    medicalNotes: 'Needs annual incisor dental checkup.',
    vaccinationStatus: 'Up to Date',
    createdAt: new Date().toISOString(),
  },
];

// Initial Appointments
const initialAppointments = [
  {
    _id: 'appt_demo_1',
    petOwnerEmail: 'sarah@example.com',
    pet: {
      _id: 'pet_max',
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
    },
    provider: {
      _id: 'prov_sharma',
      user: { name: 'Dr. Rahul Sharma', email: 'dr.sharma@petcare.com', phone: '+91 98230 11223' },
      providerType: 'Veterinarian',
      location: 'Nagpur',
    },
    service: {
      _id: 'srv_checkup',
      name: 'General Checkup',
      duration: 30,
      price: 500,
    },
    date: new Date(Date.now() + 86400000 * 2).toISOString(),
    time: '10:30 AM',
    reason: 'Routine quarterly wellness examination and nail clipping.',
    price: 500,
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: 'appt_demo_2',
    petOwnerEmail: 'sarah@example.com',
    pet: {
      _id: 'pet_bella',
      name: 'Bella',
      species: 'Cat',
      breed: 'Persian Longhair',
    },
    provider: {
      _id: 'prov_oliver',
      user: { name: 'Oliver Twist Grooming', email: 'oliver@petcare.com', phone: '+91 98230 77889' },
      providerType: 'Pet Groomer',
      location: 'Mumbai',
    },
    service: {
      _id: 'srv_bath_blow',
      name: 'Bath & Blow Dry',
      duration: 45,
      price: 750,
    },
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    time: '02:15 PM',
    reason: 'Monthly hypoallergenic coat deshedding.',
    price: 750,
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
];

// Initial Notifications
const initialNotifications = [
  {
    _id: 'notif_1',
    userEmail: 'sarah@example.com',
    type: 'APPOINTMENT_CONFIRMED',
    message: 'Dr. Rahul Sharma has confirmed your appointment for Max on 10:30 AM.',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    _id: 'notif_2',
    userEmail: 'sarah@example.com',
    type: 'APPOINTMENT_COMPLETED',
    message: 'Your appointment for Bella with Oliver Twist Grooming was marked as Completed.',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export const getStored = (key, defaultVal) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

export const setStored = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

// Initialize if empty
if (!localStorage.getItem(STORAGE_KEYS.PROVIDERS)) {
  setStored(STORAGE_KEYS.PROVIDERS, initialProviders);
}
if (!localStorage.getItem(STORAGE_KEYS.PETS)) {
  setStored(STORAGE_KEYS.PETS, initialPets);
}
if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
  setStored(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
}
if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
  setStored(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
}

export { STORAGE_KEYS };
