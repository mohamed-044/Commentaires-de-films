import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [];

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    addComment: {
      reducer(state, action) {
        state.push(action.payload);
      },
    },
    deleteComment(state, action) {
      return state.filter((comment) => comment.id !== action.payload);
    },
  },
});

export const { addComment, deleteComment } = commentSlice.actions;
export default commentSlice.reducer;
