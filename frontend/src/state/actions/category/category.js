import {
    CREATE_CATEGORY,
    RETRIEVE_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
    DELETE_ALL_CATEGORY
} from "./types"

import CategoryDataService from "../../../services/category.service"

export const createCategory = (categoryName, categoryColor) => async(dispatch) => {
    try {
        const res = await CategoryDataService.create(
            { categoryName, categoryColor }
        )

        dispatch({
            type: CREATE_CATEGORY,
            payload: res.data
        })
        return Promise.resolve(res.data)
    }
    catch(error) {
        return Promise.reject(error)
    }
}

export const retrieveCategory = () => async(dispatch) => {
    try {
        const res = await CategoryDataService.getAll()

        dispatch({
            type: RETRIEVE_CATEGORY,
            payload: res.data
        })
    }
    catch(error) {
        console.log(error)
    }
}

export const updateCategory = (id, data) => async(dispatch) => {
    try {
        const res = await CategoryDataService.update(id, data)

        dispatch({
            type: UPDATE_CATEGORY,
            payload: res.data
        })
        return Promise.resolve(res.data)
    }
    catch(error) {
        console.log(error)
        return Promise.reject(error)
    }
}

export const deleteCategory = (id) => async(dispatch) => {
    try {
        const res = await CategoryDataService.delete(id)
        
        dispatch({
            type: DELETE_CATEGORY,
            payload: { id }
        })
        return Promise.resolve(res.data)
    }
    catch(error) {
        console.log(error)
    }
}

export const deleteAllCategory = () => async(dispatch) => {
    try {
        const res = await CategoryDataService.deleteAll()

        dispatch({
            type: DELETE_ALL_CATEGORY,
            payload: res.data
        })
        return Promise.resolve(res.data)
    }
    catch(error) {
        return Promise.reject(error)
    }
}

export const findCategoryBySearchTerm = (searchTerm) => async(dispatch) => {
    try {
        const res = await CategoryDataService.findCategoryBySearchTerm(searchTerm)

        dispatch({
            type: RETRIEVE_CATEGORY,
            payload: res.data
        })
    }
    catch(error) {
        console.log(error)
    }
}