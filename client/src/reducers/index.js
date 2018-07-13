import {combineReducers} from 'redux'
import userReducer from './userReducer'
import flashMessages from './flashReducer'
import users from './searchReducer'
import tags from './tagsReducer'
import photos from './photosReducer'

export default combineReducers({
    users,
    user: userReducer,
    tags,
    flashMessages,
    photos
});