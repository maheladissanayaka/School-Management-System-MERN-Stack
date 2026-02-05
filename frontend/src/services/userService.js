import API from '../api/axiosInstance';

// 1. Get Teachers
export const getTeachers = async () => {
  const res = await API.get('/users/teachers'); 
  return res.data;
};

// 2. Get Students
export const getStudents = async () => {
  const response = await API.get('/users/students');
  return response.data;
};

// --- THIS WAS MISSING CAUSING THE ERROR ---
export const getVisitors = async () => {
  const response = await API.get('/users?role=visitor');
  return response.data;
};
// ------------------------------------------

// 4. Generic Get Users by Role
export const getUsers = async (role) => {
  const res = await API.get(`/users?role=${role}`); 
  return res.data;
};

// 5. Register New User
export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

// 6. Delete User
export const deleteUser = async (id) => {
  const response = await API.delete(`/users/${id}`);
  return response.data;
};

// 7. Update User Details
export const updateUser = async (id, data) => {
  const res = await API.put(`/users/${id}`, data); 
  return res.data;
};

export const getUserById = async (id) => {
  const res = await API.get(`/users/${id}`);
  return res.data;
};

