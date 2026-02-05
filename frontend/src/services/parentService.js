import API from '../api/axiosInstance';

export const getParents = async () => {
  const res = await API.get('/parents');
  return res.data;
};

export const createParent = async (data) => {
  const res = await API.post('/parents', data);
  return res.data;
};

export const updateParent = async (id, data) => {
  const res = await API.put(`/parents/${id}`, data);
  return res.data;
};

export const deleteParent = async (id) => {
  const res = await API.delete(`/parents/${id}`);
  return res.data;
};

export const getParentsByStudentId = async (studentId) => {
  const res = await API.get(`/parents/student/${studentId}`);
  return res.data;
};