import { configureStore } from "@reduxjs/toolkit";
import commentReducer from "./commentSlice";

const store = configureStore({
  reducer: {
    comment: commentReducer,
  },
});
export default store;