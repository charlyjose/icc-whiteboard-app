import axios from 'axios';
import authHeader from './auth-header';
const BE_IP = require('../config/env.json').backend.ip
const BE_PORT = require('../config/env.json').backend.port

const API_URL = `${BE_IP}:${BE_PORT}/api/test/`

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }
}

export default new UserService();