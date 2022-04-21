import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from "redux"
import { reducers } from './reducers'

const rootReducer = {
  app: reducers,
}

const appReducer = combineReducers(rootReducer)

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2
}

const persistReducers = persistReducer(persistConfig, appReducer)

export default () => {
  return applyMiddleware(thunk)(createStore)(persistReducers)
}