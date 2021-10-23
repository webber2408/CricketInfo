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

export const toggleAdvertisement = createAsyncThunk(
  "cricket/toggleAdvertisement",
  async (data, thunkApi) => {
    const response = await api.get(
      "/user/ads/toggle?email=" + data.email + "&ads=" + data.value
    );
    if (response.status !== 200) {
      return thunkApi.rejectWithValue({
        errorMessage: "Error toggling the advertisement status",
      });
    }
    sessionStorage.setItem("showAds", data.value);
    return;
  }
);

export const user = createSlice({
  name: "user",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {},
});

export default user.reducer;
