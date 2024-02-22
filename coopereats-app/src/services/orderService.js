import axios from 'axios';
const API_URL_ORDER = process.env.REACT_APP_BASE_URL + '/orders';

export const createOrderFromCart = (user_id) => {
  return axios.post(`${API_URL_ORDER}/placeOrder/${user_id}`);
};

export const getOrderHistory = (user_id) => {
  return axios.get(`${API_URL_ORDER}/user/${user_id}`);
};