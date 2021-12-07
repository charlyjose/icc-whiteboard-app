import axios from 'axios';
import authHeader from '../auth-header';
const BE_IP = require('../../config/env.json').backend.ip
const BE_PORT = require('../../config/env.json').backend.port

const API_URL = `${BE_IP}:${BE_PORT}/api/whiteboard`

class WhiteboardDataService {
    createWhiteboard() {
        return axios.post(API_URL + '/create', " ", { headers: authHeader() })
    }

    getWhiteboardId(joinCode) {
        return axios
            .post(API_URL + '/get/boardId/', { joinCode }, { headers: authHeader() })
            .then(response => {
                if (response.data) {
                    localStorage.setItem("whiteboard", JSON.stringify(response.data))
                }
                return response.data;
            })
    }

    authoriseWhiteboardAccess(joinCode, username) {
        return axios
        .post(API_URL + '/authorize/user/', { joinCode, username }, { headers: authHeader() })
        .then(response => {
            return response.data;
        })
    }

    getAllWhiteboards() {
        return axios.get(API_URL + '/get/all/', { headers: authHeader() })
        .then(response => {
            return response.data
        })
    }

    getCurrentWhiteboardId() {
        return JSON.parse(localStorage.getItem('whiteboard'))['boardId']
    }

    getCurrentWhiteboardAccess() {
        try {
            var whiteboardAccess = JSON.parse(localStorage.getItem('whiteboard'))['authorised']
            return (whiteboardAccess == null) ? false : whiteboardAccess
        }
        catch {
            return false
        }
    }
    
    getCurrentWhiteboardAccessMessage() {
        return JSON.parse(localStorage.getItem('whiteboard'))['message']
    }
}

export default new WhiteboardDataService();