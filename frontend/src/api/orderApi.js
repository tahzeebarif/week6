import axios from 'axios';

const API_URL = 'http://localhost:4000/api/orders';

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const createOrder = async (orderData) => {
  const response = await axios.post(API_URL, orderData, getAuthHeader());
  return response.data;
};

export const getOrders = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};

export const getMyOrders = async () => {
  const response = await axios.get(`${API_URL}/my`, getAuthHeader());
  return response.data;
};

export const getOrderStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, getAuthHeader());
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await axios.put(`${API_URL}/${id}/status`, { status }, getAuthHeader());
  return response.data;
};
