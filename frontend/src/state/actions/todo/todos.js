import {
    CREATE_TODO,
    RETRIEVE_TODOS,
    UPDATE_TODO,
    DELETE_TODO,
    DELETE_ALL_TODOS
} from "./types"

import TodoDataService from "../../../services/todo.service"

export const createTodo = (title, description, category, schedule) => async(dispatch) => {
    try {
        const res = await TodoDataService.create(
            { title, description, category, schedule }
        )
        
        dispatch({
            type: CREATE_TODO,
            payload: res.data
        })
        return Promise.resolve(res.data)
    }
    catch(error) {
        return Promise.reject(error)
    }
}

export const retrieveTodos = () => async(dispatch) => {
    try {
        const res = await TodoDataService.getAll()

        dispatch({
            type: RETRIEVE_TODOS,
            payload: res.data
        })
    }
    catch(error) {
        console.log(error)
    }
}

export const updateTodo = (id, data) => async(dispatch) => {
    try {
        const res = await TodoDataService.update(id, data)

        dispatch({
            type: UPDATE_TODO,
            payload: res.data
        })
        return Promise.resolve(res.data)
    }
    catch(error) {
        console.log(error)
        return Promise.reject(error)
    }
}

export const deleteTodo = (id) => async(dispatch) => {
    try {
        const res = await TodoDataService.delete(id)
        
        dispatch({
            type: DELETE_TODO,
            payload: { id }
        })
        return Promise.resolve(res.data)
    }
    catch(error) {
        console.log(error)
    }
}

export const deleteAllTodos = () => async(dispatch) => {
    try {
        const res = await TodoDataService.deleteAll()

        dispatch({
            type: DELETE_ALL_TODOS,
            payload: res.data
        })
        return Promise.resolve(res.data)
    }
    catch(error) {
        return Promise.reject(error)
    }
}

export const findTodosBySearchTerm = (searchTerm) => async(dispatch) => {
    try {
        const res = await TodoDataService.findTodosBySearchTerm(searchTerm)

        dispatch({
            type: RETRIEVE_TODOS,
            payload: res.data
        })
    }
    catch(error) {
        console.log(error)
    }
}