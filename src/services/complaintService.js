import api from './api';

// ─── Upload images first, get back file paths ─────────────────────────────────
// POST /api/complaints/upload
// Accepts: FormData with field "complaintImage" (up to 5 files)
// Returns: { success, files: [{ filename, path, url }] }
export const uploadComplaintImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('complaintImage', file);
  });

  const { data } = await api.post('/complaints/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data; // { success, files }
};

// ─── Create complaint ─────────────────────────────────────────────────────────
// POST /api/complaints
// Body: { title, description, department, location: { address, area, city },
//         geoLocation: { type, coordinates }, images }
// Returns: { success, complaint }
export const createComplaint = async (complaintData) => {
  const { data } = await api.post('/complaints', complaintData);
  return data.complaint;
};

// ─── Get current user's complaints ───────────────────────────────────────────
// GET /api/complaints/user
// Returns: { success, complaints }
export const getUserComplaints = async () => {
  const { data } = await api.get('/complaints/user');
  return data.complaints;
};

// ─── Get single complaint by ID ───────────────────────────────────────────────
// GET /api/complaints/:id
// Returns: { success, complaint }
export const getComplaintById = async (id) => {
  const { data } = await api.get(`/complaints/${id}`);
  return data.complaint;
};

// ─── Track complaint (public) ─────────────────────────────────────────────────
// GET /api/complaints/track/:id
// Returns: { success, complaint }  (limited fields)
export const trackComplaint = async (id) => {
  const { data } = await api.get(`/complaints/track/${id}`);
  return data.complaint;
};

// ─── Add citizen feedback ─────────────────────────────────────────────────────
// POST /api/complaints/:id/feedback
// Body: { rating, comment }
// Returns: { success, message }
export const addFeedback = async (id, rating, comment) => {
  const { data } = await api.post(`/complaints/${id}/feedback`, { rating, comment });
  return data;
};