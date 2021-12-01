import http from "../http-common"
import authHeader from './auth-header';

class ShapeDrawDataService {
    create(data) {
        return http.post("/element", data, { headers: authHeader() })
    }

    load() {
        return http.get("/element/load", { headers: authHeader() })
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