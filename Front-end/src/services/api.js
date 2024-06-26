import axios from 'axios';

const API_URL = 'https://localhost:7125/api';

const login = (identityNumber, password) => {
  return axios.post(`${API_URL}/Users/login`, { identityNumber, password });
};

const register = (firstName, lastName, email, identityNumber, password) => {
  return axios.post(`${API_URL}/Users/register`, { firstName, lastName, email, identityNumber, password });
};

const getAccounts = (token) => {
  return axios.get(`${API_URL}/Accounts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getExpenses = (token) => {
  return axios.get(`${API_URL}/Transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getTransfers = (token) => {
  return axios.get(`${API_URL}/Transfers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default {
  login,
  register,
  getAccounts,
  getExpenses,
  getTransfers,
};
