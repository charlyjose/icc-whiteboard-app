import http from "../http-common"

class TodoDataService {
    create(data) {
        return http.post("/todo", data)
    }

    get(id) {
        return http.get(`/todo/${id}`)
    }

    getAll() {
        return http.get("/todo")
    }

    update(id, data) {
        return http.put(`/todo/${id}`, data)
    }

    delete(id) {
        return http.delete(`/todo/${id}`)
    }

    deleteAll() {
        return http.delete('/todo')
    }

    findTodosBySearchTerm(searchTerm) {
        return http.get(`/todo/?searchTerm=${searchTerm}`)
    }
}

export default new TodoDataService()