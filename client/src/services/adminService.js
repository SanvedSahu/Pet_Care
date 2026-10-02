import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getProviders = async (params = {}) => {
  const response = await api.get('/admin/providers', { params });
  return response.data;
};

export const approveProvider = async (id) => {
  const response = await api.patch(`/admin/providers/${id}/approve`);
  return response.data;
};

export const rejectProvider = async (id) => {
  const response = await api.patch(`/admin/providers/${id}/reject`);
  return response.data;
};

export const suspendProvider = async (id) => {
  const response = await api.patch(`/admin/providers/${id}/suspend`);
  return response.data;
};

export const getUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const toggleUserStatus = async (id, isActive) => {
  const response = await api.patch(`/admin/users/${id}/status`, { isActive });
  return response.data;
};

export const getAllAppointments = async (params = {}) => {
  const response = await api.get('/admin/appointments', { params });
  return response.data;
};

export const getAllPets = async (params = {}) => {
  const response = await api.get('/admin/pets', { params });
  return response.data;
};
