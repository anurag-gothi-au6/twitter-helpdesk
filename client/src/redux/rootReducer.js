import { combineReducers } from 'redux'
//All reducers
import userReducer from './reducers/userReducer'

const rootReducer = combineReducers({
    userState: userReducer
})

export default rootReducer;