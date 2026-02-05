import API from '../api/axiosInstance';

// Get All Subjects
export const getSubjects = async () => {
  const res = await API.get('/subjects');
  return res.data;
};

// Create Subject
export const createSubject = async (data) => {
  const res = await API.post('/subjects', data);
  return res.data;
};

// Update Subject
export const updateSubject = async (id, data) => {
  const res = await API.put(`/subjects/${id}`, data);
  return res.data;
};

// Delete Subject
export const deleteSubject = async (id) => {
  const res = await API.delete(`/subjects/${id}`);
  return res.data;
};

export const getSubjectsByTeacher = async (teacherId) => {
  const res = await API.get(`/subjects/teacher/${teacherId}`);
  return res.data;
};

export const getUserById = async (id) => {
  const res = await API.get(`/users/${id}`);
  return res.data;
};

