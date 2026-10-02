import api from './api';
import { getStored, STORAGE_KEYS } from './mockDataStore';

export const getProviders = async (params = {}) => {
  try {
    const res = await api.get('/providers', { params });
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend unavailable, using mock providers:', err.message);
  }

  // Filter from mock store
  let providers = getStored(STORAGE_KEYS.PROVIDERS, []);

  // Filter approved only
  providers = providers.filter((p) => p.approvalStatus === 'Approved');

  if (params.type && params.type !== 'All') {
    providers = providers.filter(
      (p) => p.providerType?.toLowerCase() === params.type?.toLowerCase()
    );
  }

  if (params.location && params.location !== 'All') {
    providers = providers.filter((p) =>
      p.location?.toLowerCase().includes(params.location.toLowerCase())
    );
  }

  if (params.minRating) {
    providers = providers.filter((p) => (p.rating || 0) >= Number(params.minRating));
  }

  if (params.search) {
    const term = params.search.toLowerCase();
    providers = providers.filter(
      (p) =>
        p.user?.name?.toLowerCase().includes(term) ||
        p.specialization?.toLowerCase().includes(term) ||
        p.location?.toLowerCase().includes(term) ||
        p.providerType?.toLowerCase().includes(term) ||
        p.services?.some((s) => s.name?.toLowerCase().includes(term))
    );
  }

  return providers;
};

export const getProviderById = async (id) => {
  try {
    const res = await api.get(`/providers/${id}`);
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend unavailable, fetching provider by id from mock store:', err.message);
  }

  const providers = getStored(STORAGE_KEYS.PROVIDERS, []);
  const provider = providers.find((p) => p._id === id || p.user?._id === id);
  if (!provider) throw new Error('Provider not found');
  return provider;
};
