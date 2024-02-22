import axios from 'axios';
const API_URL = process.env.REACT_APP_BASE_URL + '/users';

export const createUser = (userData) => {
  return axios.post(API_URL, userData);
};

export const getUser = (user_id) => {
  return axios.get(`${API_URL}/${user_id}`);
};
