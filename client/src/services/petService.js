import api from './api';
import { getStored, setStored, STORAGE_KEYS } from './mockDataStore';

export const getPets = async () => {
  try {
    const res = await api.get('/pets');
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend unavailable, using client store for pets:', err.message);
  }

  // Fallback to local store for current user
  const user = JSON.parse(localStorage.getItem('petcare_user') || '{}');
  const allPets = getStored(STORAGE_KEYS.PETS, []);
  if (user && user.email) {
    return allPets.filter((p) => p.ownerEmail === user.email || !p.ownerEmail);
  }
  return allPets;
};

export const getPetById = async (id) => {
  try {
    const res = await api.get(`/pets/${id}`);
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend unavailable, fetching pet from store:', err.message);
  }

  const allPets = getStored(STORAGE_KEYS.PETS, []);
  const pet = allPets.find((p) => p._id === id);
  if (!pet) throw new Error('Pet not found');
  return pet;
};

export const createPet = async (petData) => {
  try {
    const res = await api.post('/pets', petData);
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend unavailable, saving pet to local store:', err.message);
  }

  const user = JSON.parse(localStorage.getItem('petcare_user') || '{}');
  const allPets = getStored(STORAGE_KEYS.PETS, []);
  const newPet = {
    ...petData,
    _id: 'pet_' + Date.now(),
    ownerEmail: user?.email || 'sarah@example.com',
    createdAt: new Date().toISOString(),
  };

  const updated = [newPet, ...allPets];
  setStored(STORAGE_KEYS.PETS, updated);
  return newPet;
};

export const updatePet = async (id, petData) => {
  try {
    const res = await api.put(`/pets/${id}`, petData);
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend unavailable, updating pet in local store:', err.message);
  }

  const allPets = getStored(STORAGE_KEYS.PETS, []);
  const index = allPets.findIndex((p) => p._id === id);
  if (index === -1) throw new Error('Pet not found');

  const updatedPet = { ...allPets[index], ...petData };
  allPets[index] = updatedPet;
  setStored(STORAGE_KEYS.PETS, allPets);
  return updatedPet;
};

export const deletePet = async (id) => {
  try {
    const res = await api.delete(`/pets/${id}`);
    if (res.data && res.data.success) {
      return true;
    }
  } catch (err) {
    console.warn('Backend unavailable, deleting pet from local store:', err.message);
  }

  const allPets = getStored(STORAGE_KEYS.PETS, []);
  const filtered = allPets.filter((p) => p._id !== id);
  setStored(STORAGE_KEYS.PETS, filtered);
  return true;
};
