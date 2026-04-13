import axios from 'axios';

const API_URL = 'http://localhost:4000/api/users';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getAllUsers = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await axios.put(`${API_URL}/${userId}/role`, { role }, getAuthHeader());
  return response.data;
};
