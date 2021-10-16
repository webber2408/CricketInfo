import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../apiClient/axios";

const initialState = {
  token: "",
};

export const login = createAsyncThunk(
  "cricket/login",
  async (data, thunkApi) => {
    const response = await api.post("/login", {
      ...data,
    });
    if (response.status !== 200) {
      return thunkApi.rejectWithValue({
        errorMessage: "Error fetching the matches",
      });
    }
    if (response.data && response.data.token) {
      localStorage.setItem("TOKEN", response.data.token);
    }
    localStorage.setItem("USER_EMAIL", response.data?.email);
    return await response.data;
  }
);

export const register = createAsyncThunk(
  "cricket/register",
  async (data, thunkApi) => {
    const response = await api.post("/register", {
      ...data,
    });
    if (response.status !== 200) {
      return thunkApi.rejectWithValue({
        errorMessage: "Error fetching the matches",
      });
    }
    return await response.data;
  }
);

export const authentication = createSlice({
  name: "authentication",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, { payload }) => {
      console.log(payload);
      state.token = payload.token;
    });
  },
});

export default authentication.reducer;
