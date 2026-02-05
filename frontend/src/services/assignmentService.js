import API from '../api/axiosInstance';

// Get All Assignments
export const getAssignments = async () => {
  const res = await API.get('/assignments');
  return res.data;
};

// Create Assignment
export const createAssignment = async (data) => {
  const res = await API.post('/assignments', data);
  return res.data;
};

// Update Assignment
export const updateAssignment = async (id, data) => {
  const res = await API.put(`/assignments/${id}`, data);
  return res.data;
};

// Delete Assignment
export const deleteAssignment = async (id) => {
  const res = await API.delete(`/assignments/${id}`);
  return res.data;
};

// Toggle Portal Status
export const toggleAssignmentPortal = async (id) => {
  const res = await API.put(`/assignments/${id}/toggle`);
  return res.data;
};

// Submit Assignment (Student)
export const submitAssignment = async (id, data) => {
  const res = await API.post(`/assignments/${id}/submit`, data);
  return res.data;
};