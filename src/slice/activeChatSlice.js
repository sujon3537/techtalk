import { createSlice } from '@reduxjs/toolkit'

export const activeChatSlice = createSlice({
  name: 'activeChat',
  initialState: {
    active: "something",
  },
  reducers: {
    activeChat: (state, action) => {
      state.active = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { activeChat } = activeChatSlice.actions

export default activeChatSlice.reducer