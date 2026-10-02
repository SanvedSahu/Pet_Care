const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Pet = require('../models/Pet');
const ProviderProfile = require('../models/ProviderProfile');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const { users, petsData, servicesData } = require('./seedData');

dotenv.config({ path: `${__dirname}/../.env` });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/petcare');
    console.log(`[MongoDB] Connected for Seeder: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Seeder connection error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Wiping existing data...');
    await User.deleteMany();
    await Pet.deleteMany();
    await ProviderProfile.deleteMany();
    await Service.deleteMany();
    await Appointment.deleteMany();
    await Notification.deleteMany();

    console.log('[Seeder] All collections cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing prior collections before import...');
    await User.deleteMany();
    await Pet.deleteMany();
    await ProviderProfile.deleteMany();
    await Service.deleteMany();
    await Appointment.deleteMany();
    await Notification.deleteMany();

    console.log('[Seeder] Seeding Users and Provider Profiles...');
    const userMap = {};
    const providerProfileMap = {};

    for (const userData of users) {
      const { providerProfile, ...userInfo } = userData;

      // Create user using new User() + save() to invoke bcrypt hook
      const user = new User(userInfo);
      await user.save();
      userMap[user.email] = user;

      if (providerProfile && user.role === 'SERVICE_PROVIDER') {
        const profile = await ProviderProfile.create({
          user: user._id,
          ...providerProfile,
        });
        providerProfileMap[user.email] = profile;
      }
    }

    console.log(`[Seeder] Seeded ${Object.keys(userMap).length} users and ${Object.keys(providerProfileMap).length} provider profiles.`);

    console.log('[Seeder] Seeding Pets...');
    const petMap = {};
    for (const p of petsData) {
      const owner = userMap[p.ownerEmail];
      if (!owner) continue;

      const pet = await Pet.create({
        owner: owner._id,
        name: p.name,
        species: p.species,
        breed: p.breed,
        gender: p.gender,
        age: p.age,
        weight: p.weight,
        medicalNotes: p.medicalNotes,
        vaccinationStatus: p.vaccinationStatus,
        image: p.image,
      });
      petMap[p.name] = pet;
    }
    console.log(`[Seeder] Seeded ${Object.keys(petMap).length} pets.`);

    console.log('[Seeder] Seeding Services...');
    const serviceList = [];
    for (const s of servicesData) {
      const provider = providerProfileMap[s.providerEmail];
      if (!provider) continue;

      const service = await Service.create({
        provider: provider._id,
        name: s.name,
        category: s.category,
        duration: s.duration,
        price: s.price,
        description: s.description,
        isActive: s.isActive,
      });
      serviceList.push(service);
    }
    console.log(`[Seeder] Seeded ${serviceList.length} services.`);

    console.log('[Seeder] Seeding Sample Appointments...');
    const sarahUser = userMap['sarah@example.com'];
    const michaelUser = userMap['michael@example.com'];
    const maxPet = petMap['Max'];
    const miloPet = petMap['Milo'];
    const drSharmaProfile = providerProfileMap['dr.sharma@petcare.com'];
    const oliverProfile = providerProfileMap['oliver@petcare.com'];
    const alexProfile = providerProfileMap['alex@petcare.com'];

    const checkupService = serviceList.find(
      (s) => s.provider.toString() === drSharmaProfile?._id.toString() && s.name === 'General Checkup'
    );
    const groomingService = serviceList.find(
      (s) => s.provider.toString() === oliverProfile?._id.toString() && s.name === 'Full Breed Grooming'
    );
    const obedienceService = serviceList.find(
      (s) => s.provider.toString() === alexProfile?._id.toString() && s.name === 'Basic Obedience'
    );

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const inThreeDays = new Date();
    inThreeDays.setDate(inThreeDays.getDate() + 3);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const appointmentsCreated = [];

    if (sarahUser && maxPet && drSharmaProfile && checkupService) {
      const appt1 = await Appointment.create({
        petOwner: sarahUser._id,
        pet: maxPet._id,
        provider: drSharmaProfile._id,
        service: checkupService._id,
        date: tomorrow,
        time: '10:30 AM',
        reason: 'Routine annual booster checkup and wellness exam',
        price: checkupService.price,
        status: 'Pending',
      });
      appointmentsCreated.push(appt1);
    }

    if (michaelUser && miloPet && oliverProfile && groomingService) {
      const appt2 = await Appointment.create({
        petOwner: michaelUser._id,
        pet: miloPet._id,
        provider: oliverProfile._id,
        service: groomingService._id,
        date: inThreeDays,
        time: '02:15 PM',
        reason: 'Full breed bath, sanitary trimming, and nail clipping',
        price: groomingService.price,
        status: 'Confirmed',
      });
      appointmentsCreated.push(appt2);
    }

    if (sarahUser && maxPet && alexProfile && obedienceService) {
      const appt3 = await Appointment.create({
        petOwner: sarahUser._id,
        pet: maxPet._id,
        provider: alexProfile._id,
        service: obedienceService._id,
        date: yesterday,
        time: '11:15 AM',
        reason: 'Loose-leash walking and recall practice',
        price: obedienceService.price,
        status: 'Completed',
      });
      appointmentsCreated.push(appt3);
    }

    console.log(`[Seeder] Seeded ${appointmentsCreated.length} sample appointments.`);

    console.log('[Seeder] Seeding Sample Notifications...');
    const drSharmaUser = userMap['dr.sharma@petcare.com'];
    if (drSharmaUser) {
      await Notification.create({
        user: drSharmaUser._id,
        message: 'New appointment request from Sarah Jenkins for Max on tomorrow, 10:30 AM.',
        type: 'APPOINTMENT_BOOKED',
      });
    }

    if (michaelUser) {
      await Notification.create({
        user: michaelUser._id,
        message: 'Oliver Twist Grooming has confirmed your appointment for Milo on in 3 days, 02:15 PM.',
        type: 'APPOINTMENT_CONFIRMED',
      });
    }

    const adminUser = userMap['admin@petcare.com'];
    if (adminUser) {
      await Notification.create({
        user: adminUser._id,
        message: 'New service provider registration awaiting verification: Dr. Emily Watson (Mumbai).',
        type: 'SYSTEM',
      });
    }

    console.log('[Seeder] Database successfully seeded with all initial demo data!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

if (process.argv[2] === '-d' || process.argv[2] === '--destroy') {
  destroyData();
} else if (process.argv[2] === '-i' || process.argv[2] === '--import') {
  importData();
} else {
  // Default to import
  importData();
}
