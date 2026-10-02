import api from './api';
import { getStored, setStored, STORAGE_KEYS } from './mockDataStore';

export const bookAppointment = async (bookingData) => {
  try {
    const res = await api.post('/appointments', bookingData);
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    }
    console.warn('Backend unavailable, saving appointment to mock store:', err.message);
  }

  // Fallback to local store
  const user = JSON.parse(localStorage.getItem('petcare_user') || '{}');
  const providers = getStored(STORAGE_KEYS.PROVIDERS, []);
  const pets = getStored(STORAGE_KEYS.PETS, []);
  const appointments = getStored(STORAGE_KEYS.APPOINTMENTS, []);

  const provider = providers.find((p) => p._id === bookingData.providerId);
  const service = provider?.services?.find((s) => s._id === bookingData.serviceId);
  const pet = pets.find((p) => p._id === bookingData.petId);

  // Check collision
  const bookedDateStr = new Date(bookingData.date).toDateString();
  const collision = appointments.find((a) => {
    const aDateStr = new Date(a.date).toDateString();
    return (
      a.provider?._id === bookingData.providerId &&
      aDateStr === bookedDateStr &&
      a.time === bookingData.time &&
      ['Pending', 'Confirmed'].includes(a.status)
    );
  });

  if (collision) {
    throw new Error('This time slot is already reserved. Please select another slot.');
  }

  const newAppointment = {
    _id: 'appt_' + Date.now(),
    petOwnerEmail: user?.email || 'sarah@example.com',
    pet: pet || { name: 'My Pet', species: 'Pet' },
    provider: {
      _id: provider?._id || bookingData.providerId,
      user: provider?.user || { name: 'Dr. Rahul Sharma' },
      providerType: provider?.providerType || 'Veterinarian',
      location: provider?.location || 'Nagpur',
    },
    service: service || {
      _id: bookingData.serviceId,
      name: 'General Checkup',
      duration: 30,
      price: 500,
    },
    date: bookingData.date,
    time: bookingData.time,
    reason: bookingData.reason || 'General checkup',
    price: service?.price || 500, // Authoritative price lock
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  const updatedAppointments = [newAppointment, ...appointments];
  setStored(STORAGE_KEYS.APPOINTMENTS, updatedAppointments);

  // Also add in-app notification
  const notifications = getStored(STORAGE_KEYS.NOTIFICATIONS, []);
  const newNotif = {
    _id: 'notif_' + Date.now(),
    userEmail: user?.email || 'sarah@example.com',
    type: 'APPOINTMENT_BOOKED',
    message: `Appointment request submitted for ${pet?.name || 'your pet'} with ${provider?.user?.name || 'specialist'} on ${bookingData.time}.`,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  setStored(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifications]);

  return newAppointment;
};

export const getMyAppointments = async (status = 'All') => {
  try {
    const res = await api.get('/appointments/my', {
      params: status !== 'All' ? { status } : {},
    });
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend unavailable, fetching owner appointments from mock store:', err.message);
  }

  const user = JSON.parse(localStorage.getItem('petcare_user') || '{}');
  const all = getStored(STORAGE_KEYS.APPOINTMENTS, []);
  let userAppts = all.filter((a) => a.petOwnerEmail === user?.email || !a.petOwnerEmail);

  if (status && status !== 'All') {
    if (status === 'Upcoming') {
      userAppts = userAppts.filter((a) => ['Pending', 'Confirmed'].includes(a.status));
    } else if (status === 'Cancelled') {
      userAppts = userAppts.filter((a) => ['Cancelled', 'Rejected'].includes(a.status));
    } else {
      userAppts = userAppts.filter((a) => a.status === status);
    }
  }

  return userAppts;
};

export const getProviderBookedSlots = async (providerId, date) => {
  try {
    const res = await api.get('/appointments/booked-slots', {
      params: { providerId, date },
    });
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    // try fallback
  }

  const all = getStored(STORAGE_KEYS.APPOINTMENTS, []);
  const targetDateStr = new Date(date).toDateString();
  const booked = all
    .filter((a) => {
      const aDateStr = new Date(a.date).toDateString();
      return (
        a.provider?._id === providerId &&
        aDateStr === targetDateStr &&
        ['Pending', 'Confirmed'].includes(a.status)
      );
    })
    .map((a) => a.time);

  return booked;
};

export const cancelAppointment = async (id) => {
  try {
    const res = await api.patch(`/appointments/${id}/status`, { status: 'Cancelled' });
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend unavailable, cancelling appointment in mock store:', err.message);
  }

  const all = getStored(STORAGE_KEYS.APPOINTMENTS, []);
  const index = all.findIndex((a) => a._id === id);
  if (index !== -1) {
    all[index].status = 'Cancelled';
    setStored(STORAGE_KEYS.APPOINTMENTS, all);
    return all[index];
  }
  throw new Error('Appointment not found');
};
