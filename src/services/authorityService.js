import api from './api';

// ─── Complaints ───────────────────────────────────────────────────────────────
export const getDepartmentComplaints = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v && v !== 'all') params.append(k, v); });
  const { data } = await api.get(`/authority/complaints?${params}`);
  return data.complaints;
};

export const getDepartmentComplaint = async (id) => {
  const { data } = await api.get(`/authority/complaints/${id}`);
  return data.complaint;
};

export const updateComplaintStatus = async (id, status, progress, note = '') => {
  const { data } = await api.put(`/authority/complaints/${id}/status`, { status, progress, note });
  return data.complaint;
};

export const updateProgress = async (id, progress, note = '') => {
  const { data } = await api.put(`/authority/complaints/${id}/progress`, { progress, note });
  return data.complaint;
};

// ─── Stats ────────────────────────────────────────────────────────────────────
export const getDepartmentStats = async () => {
  const { data } = await api.get('/authority/stats');
  return data.stats;
};

// ─── Feedback ─────────────────────────────────────────────────────────────────
export const getDepartmentFeedback = async () => {
  const { data } = await api.get('/authority/feedback');
  return { feedback: data.feedback, averageRating: data.averageRating };
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const getNotifications = async () => {
  const { data } = await api.get('/authority/notifications');
  return { notifications: data.notifications, unreadCount: data.unreadCount };
};

export const markNotificationRead = async (id) => {
  const { data } = await api.put(`/authority/notifications/${id}/read`);
  return data.notification;
};

export const markAllNotificationsRead = async () => {
  await api.put('/authority/notifications/mark-all-read');
};

export const deleteNotification = async (id) => {
  await api.delete(`/authority/notifications/${id}`);
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export const getProfile = async () => {
  const { data } = await api.get('/authority/profile');
  return data.user;
};

export const updateProfile = async (profileData) => {
  const { data } = await api.put('/authority/profile', profileData);
  return data.user;
};

export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await api.put('/authority/change-password', { currentPassword, newPassword });
  return data;
};