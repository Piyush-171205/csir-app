import api from './api';

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const getAdminStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data.stats;
};

// ─── Officers ─────────────────────────────────────────────────────────────────
export const getOfficers = async () => {
  const { data } = await api.get('/admin/officers');
  return data.officers;
};
export const createOfficer = async (payload) => {
  const { data } = await api.post('/admin/officers', payload);
  return data.officer;
};
export const updateOfficer = async (id, payload) => {
  const { data } = await api.put(`/admin/officers/${id}`, payload);
  return data.officer;
};
export const deleteOfficer = async (id) => {
  const { data } = await api.delete(`/admin/officers/${id}`);
  return data;
};

// ─── Citizens ─────────────────────────────────────────────────────────────────
export const getCitizens = async () => {
  const { data } = await api.get('/admin/citizens');
  return data.citizens;
};
export const updateCitizenStatus = async (id, status) => {
  const { data } = await api.put(`/admin/citizens/${id}/status`, { status });
  return data.citizen;
};
export const deleteCitizen = async (id) => {
  const { data } = await api.delete(`/admin/citizens/${id}`);
  return data;
};

// ─── Complaints ───────────────────────────────────────────────────────────────
export const getAllComplaints = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v && v !== 'all') params.append(k, v); });
  const { data } = await api.get(`/admin/complaints?${params.toString()}`);
  return data.complaints;
};
export const assignComplaint = async (complaintId, officerId) => {
  const { data } = await api.put(`/admin/complaints/${complaintId}/assign`, { officerId });
  return data.complaint;
};
export const updateComplaintStatus = async (complaintId, status, note = '') => {
  const { data } = await api.put(`/admin/complaints/${complaintId}/status`, { status, note });
  return data.complaint;
};

// ─── Announcements ────────────────────────────────────────────────────────────
export const getAnnouncements = async () => {
  const { data } = await api.get('/admin/announcements');
  return data.announcements;
};
export const createAnnouncement = async (payload) => {
  const { data } = await api.post('/admin/announcements', payload);
  return data.announcement;
};
export const updateAnnouncement = async (id, payload) => {
  const { data } = await api.put(`/admin/announcements/${id}`, payload);
  return data.announcement;
};
export const deleteAnnouncement = async (id) => {
  const { data } = await api.delete(`/admin/announcements/${id}`);
  return data;
};

// ─── Reports ──────────────────────────────────────────────────────────────────
export const getReports = async (year) => {
  const { data } = await api.get(`/admin/reports?year=${year}`);
  return data.reports;
};

// ─── Department stats (Categories page) ──────────────────────────────────────
export const getDepartmentStats = async () => {
  const { data } = await api.get('/admin/department-stats');
  return data.stats; // { road: 12, water: 5, ... }
};