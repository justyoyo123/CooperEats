import axios from 'axios';
const API_URL_CART = process.env.REACT_APP_BASE_URL + '/carts';

export const createCart = (user_id, cartData) => {
  return axios.post(`${API_URL_CART}/user/${user_id}`, cartData);
};

export const getCart = (user_id) => {
  return axios.get(`${API_URL_CART}/user/${user_id}`);
};