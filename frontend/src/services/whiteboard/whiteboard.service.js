import axios from 'axios';
import authHeader from '../auth-header';

const API_URL = 'http://localhost:8080/api/whiteboard';

class WhiteboardDataService {
    createWhiteboard() {
        return axios.post(API_URL + '/create', " ", { headers: authHeader() })
    }

    getWhiteboardId(joinCode) {
        return axios
            .post(API_URL + '/get/boardId/', { joinCode }, { headers: authHeader() })
            .then(response => {
                if (response.data) {
                    console.log(response.data)
                    localStorage.setItem("whiteboard", JSON.stringify(response.data))
                }
                return response.data;
            })
    }

    authoriseWhiteboardAccess(ownership) {
        var boardId = JSON.parse(localStorage.getItem('boardId'))
        // console.log('PRINT: ', boardId)

        return axios
        .post(API_URL + '/authorize/user/', { boardId, ownership }, { headers: authHeader() })
        .then(response => {
            console.log('Response:' + response)
            return response.data;
        })
    }

    getCurrentWhiteboardId() {
        return JSON.parse(localStorage.getItem('whiteboard'))['boardId']
    }

    getCurrentWhiteboardAccess() {
        return JSON.parse(localStorage.getItem('whiteboard'))['authorised']
    }
    
    getCurrentWhiteboardAccessMessage() {
        return JSON.parse(localStorage.getItem('whiteboard'))['message']
    }
}

export default new WhiteboardDataService();