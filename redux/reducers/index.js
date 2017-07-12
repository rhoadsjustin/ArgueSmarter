import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  user: require('./users').default,
})

export default rootReducer;
