import { configureStore } from "@reduxjs/toolkit";
import cricketReducer from "./slices/cricketSlice";

export default configureStore({
  reducer: {
    cricket: cricketReducer,
  },
});
