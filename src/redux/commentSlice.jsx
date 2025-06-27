import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [];

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    addComment: (state, action) => {
      state.push({ id: nanoid(), text: action.payload.text, note: action.payload.note });
    },
    prepare({ text, note }) {
    return { payload: { text, note } };
    },

    deleteComment: (state, action) =>
      state.filter(t => t.id !== action.payload), 
  },
});


export const { addComment, deleteComment } = commentSlice.actions;
export default commentSlice.reducer;