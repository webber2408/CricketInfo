import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./slices/authenticationSlice";
import topicReducer from "./slices/topicSlice";
import cricketReducer from "./slices/cricketSlice";
import userReducer from "./slices/userSlice";

export default configureStore({
  reducer: {
    cricket: cricketReducer,
    authentication: authenticationReducer,
    topic: topicReducer,
    user: userReducer,
  },
});
