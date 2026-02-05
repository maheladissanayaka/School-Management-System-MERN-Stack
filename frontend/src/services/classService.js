import API from '../api/axiosInstance';

export const getAllClasses = async () => {
  try {
    const response = await API.get('/classes');
    return response.data;
  } catch (error) {
    // If 404 or 403, just return empty array to prevent crash
    console.warn("Could not fetch classes:", error);
    return [];
  }
};

export const createClass = async (data) => {
  const res = await API.post('/classes', data);
  return res.data;
};

export const updateClass = async (id, data) => {
  const res = await API.put(`/classes/${id}`, data);
  return res.data;
};

export const deleteClass = async (id) => {
  const res = await API.delete(`/classes/${id}`);
  return res.data;
};