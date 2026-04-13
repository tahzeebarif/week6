import axios from 'axios';

const API_URL = 'http://localhost:4000/api/reviews';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getLatestReviews = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getReviewsByProductId = async (productId) => {
  const response = await axios.get(`${API_URL}/${productId}`);
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await axios.post(API_URL, reviewData, getAuthHeader());
  return response.data;
};
