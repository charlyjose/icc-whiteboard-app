import axios from 'axios';
import authHeader from '../auth-header';

const API_URL = 'http://localhost:8080/api/whiteboard/drawing';

class DrawingDataService {
    create(data) {
        return axios.post(API_URL + "/create", data, { headers: authHeader() })
    }

    load() {
        return axios.get(API_URL + "/load", { headers: authHeader() })
    }
}

export default new DrawingDataService()