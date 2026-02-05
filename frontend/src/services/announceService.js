import API from '../api/axiosInstance';

// Ensure this name matches what you import in Announcements.jsx
export const getAllAnnouncements = async () => {
  const res = await API.get('/announcements');
  return res.data;
};

export const createAnnouncement = async (data) => {
  const res = await API.post('/announcements', data);
  return res.data;
};

export const updateAnnouncement = async (id, data) => {
  const res = await API.put(`/announcements/${id}`, data);
  return res.data;
};

export const deleteAnnouncement = async (id) => {
  const res = await API.delete(`/announcements/${id}`);
  return res.data;
};