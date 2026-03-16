import api from './api';

// ─── Login ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Returns: { success, token, user }
export const loginUser = async (username, password) => {
  let userType = "citizen";  // default userType
  if(username ==="Admin@123" && password === "Admin@123") {
    userType = "admin";
  }
    const { data } = await api.post('/auth/login', { username, password, userType });

  // Persist token + user so session survives a page refresh
  localStorage.setItem('csir_token', data.token);
  localStorage.setItem('csir_user', JSON.stringify(data.user));

  return data.user; // { _id, firstName, lastName, email, username, userType, department }
};

// ─── Register ─────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Returns: { success, token, user }
export const registerUser = async (formData) => {
  const { data } = await api.post('/auth/register', formData);
  return data;
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
// POST /api/auth/forgot-password  { email }
// Returns: { success, message }
export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

// ─── Reset Password ───────────────────────────────────────────────────────────
// POST /api/auth/reset-password  { email, newPassword }
// Returns: { success, message }
export const resetPassword = async (email, newPassword) => {
  const { data } = await api.post('/auth/reset-password', { email, newPassword });
  return data;
};

// ─── Get Profile (used on app boot to restore session) ────────────────────────
// GET /api/auth/profile   (requires Bearer token)
// Returns: { success, user }
export const getProfile = async () => {
  const { data } = await api.get('/auth/profile');
  return data.user;
};

// ─── Update Profile ───────────────────────────────────────────────────────────
// PUT /api/auth/profile
export const updateProfile = async (profileData) => {
  const { data } = await api.put('/auth/profile', profileData);
  return data.user;
};

// ─── Change Password ──────────────────────────────────────────────────────────
// PUT /api/auth/change-password
export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await api.put('/auth/change-password', { currentPassword, newPassword });
  return data;
};

// ─── Logout (client-side) ─────────────────────────────────────────────────────
export const logoutUser = () => {
  localStorage.removeItem('csir_token');
  localStorage.removeItem('csir_user');
};