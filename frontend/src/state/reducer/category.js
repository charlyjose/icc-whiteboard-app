import {
    CREATE_CATEGORY,
    RETRIEVE_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
    DELETE_ALL_CATEGORY
} from "../actions/category/types"

const initialState = []

function categoryReducer(categories = initialState, action) {
    const { type, payload } = action

    switch(type) {
        case CREATE_CATEGORY:
            return [...categories, payload]
        case RETRIEVE_CATEGORY:
            return payload
        case UPDATE_CATEGORY:
             return categories.map((category) => {
                 if(category.id === payload.id) {
                     return {...todo, ...payload}
                 }
                 else {
                     return todo
                 }
             })
        case DELETE_CATEGORY:
            return categories.filter(({ id }) => id !== payload.id)
        case DELETE_ALL_CATEGORY:
            return []
        default:
            return categories
    }
}

export default categoryReducer