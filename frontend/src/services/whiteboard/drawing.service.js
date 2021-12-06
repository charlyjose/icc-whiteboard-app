import axios from 'axios';
import authHeader from '../auth-header';
const BE_IP = require('../../config/env.json').backend.ip
const BE_PORT = require('../../config/env.json').backend.port

const API_URL = `${BE_IP}:${BE_PORT}/api/whiteboard/drawing`

class DrawingDataService {
    create(whiteboardId, elements) {
        console.log({ whiteboardId, elements })
        return axios.post(API_URL + "/create", { whiteboardId, elements }, { headers: authHeader() })
    }

    load(whiteboardId) {
        return axios.get(API_URL + "/load", { headers: authHeader(), params: { whiteboardId: whiteboardId } })
    }

    sync(whiteboardId, idList) {
        return axios.get(API_URL + "/sync", { headers: authHeader(), params: { whiteboardId: whiteboardId, idList: idList } })
    }
}

export default new DrawingDataService()