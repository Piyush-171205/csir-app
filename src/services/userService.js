import api from './api';

// ─── Get dashboard stats ───────────────────────────────────────────────────────
// GET /api/users/stats
// Returns: { success, stats: { total, pending, inProgress, resolved, completionRate } }
export const getUserStats = async () => {
  const { data } = await api.get('/users/stats');
  return data.stats;
};

// ─── Get recent complaints for activity feed ──────────────────────────────────
// GET /api/complaints/user  (reuses complaintService, imported separately in components)

// ─── Get user profile ─────────────────────────────────────────────────────────
// GET /api/users/profile
export const getUserProfile = async () => {
  const { data } = await api.get('/users/profile');
  return data.user;
};

// ─── Update user profile ──────────────────────────────────────────────────────
// PUT /api/users/profile
export const updateUserProfile = async (profileData) => {
  const { data } = await api.put('/users/profile', profileData);
  return data.user;
};

// ─── Change password ──────────────────────────────────────────────────────────
// PUT /api/users/change-password
export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await api.put('/users/change-password', { currentPassword, newPassword });
  return data;
};

// ─── Get notifications ────────────────────────────────────────────────────────
// GET /api/users/notifications
// Returns: { success, notifications, unreadCount }
export const getUserNotifications = async () => {
  const { data } = await api.get('/users/notifications');
  return { notifications: data.notifications, unreadCount: data.unreadCount };
};