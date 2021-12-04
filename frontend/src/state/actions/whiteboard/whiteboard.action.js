import {
    CREATE_WHITEBOARD
} from "./types"

import CategoryDataService from "../../../services/category.service"

export const createCategory = (categoryName, categoryColor) => async(dispatch) => {
    try {
        const res = await CategoryDataService.create(
            { categoryName, categoryColor }
        )

        dispatch({
            type: CREATE_WHITEBOARD,
            payload: res.data
        })
        return Promise.resolve(res.data)
    }
    catch(error) {
        return Promise.reject(error)
    }
}