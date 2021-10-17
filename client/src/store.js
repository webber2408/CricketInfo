import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./slices/authenticationSlice";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import topicReducer from "./slices/topicSlice";
import cricketReducer from "./slices/cricketSlice";
import userReducer from "./slices/userSlice";

const reducers = combineReducers({
  cricket: cricketReducer,
  authentication: authenticationReducer,
  topic: topicReducer,
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
});
