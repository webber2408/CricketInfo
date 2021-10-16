import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../apiClient/axios";

export const getUserProfile = createAsyncThunk(
  "cricket/userProfile",
  async (email, thunkApi) => {
    const response = await api.get("/user/profile?email=" + email);
    if (response.status !== 200) {
      return thunkApi.rejectWithValue({
        errorMessage: "Error fetching the matches",
      });
    }
    return await response.data.data;
  }
);

export const user = createSlice({
  name: "user",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {},
});

export default user.reducer;
