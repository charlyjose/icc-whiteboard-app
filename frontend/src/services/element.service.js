import http from "../http-common"

class ShapeDrawDataService {
    create(data) {
        return http.post("/element", data)
    }

    get(id) {
        return http.get(`/category/${id}`)
    }

    getAll() {
        return http.get("/category")
    }

    update(id, data) {
        return http.put(`/category/${id}`, data)
    }

    delete(id) {
        return http.delete(`/category/${id}`)
    }

    deleteAll() {
        return http.delete('/category')
    }

    findCategoryBySearchTerm(searchTerm) {
        return http.get(`/category/?searchTerm=${searchTerm}`)
    }
}

export default new ShapeDrawDataService()