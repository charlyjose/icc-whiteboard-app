import {
    CREATE_TODO,
    RETRIEVE_TODOS,
    UPDATE_TODO,
    DELETE_TODO,
    DELETE_ALL_TODOS
} from "../actions/todo/types"

const initialState = []

function todoReducer(todos = initialState, action) {
    const { type, payload } = action

    switch(type) {
        case CREATE_TODO:
            return [...todos, payload]
        case RETRIEVE_TODOS:
            return payload
        case UPDATE_TODO:
             return todos.map((todo) => {
                 if(todo.id === payload.id) {
                     return {...todo, ...payload}
                 }
                 else {
                     return todo
                 }
             })
        case DELETE_TODO:
            return todos.filter(({ id }) => id !== payload.id)
        case DELETE_ALL_TODOS:
            return []
        default:
            return todos
    }
}

export default todoReducer