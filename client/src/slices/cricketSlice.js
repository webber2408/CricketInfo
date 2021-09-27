import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../apiClient/axios";

const initialState = {
  matches: [],
  matchStats: [],
  matchAdded: false,
};

export const getAllMatches = createAsyncThunk(
  "cricket/getAllMatches",
  async (thunkApi) => {
    const response = await api.get("/cricket/all");
    if (response.status !== 200) {
      return thunkApi.rejectWithValue({
        errorMessage: "Error fetching the matches",
      });
    }
    return await response.data.data;
  }
);

export const getMatchStats = createAsyncThunk(
  "cricket/getMatchStats",
  async (thunkApi) => {
    const response = await api.get("/cricket/teamStatistics");
    if (response.status !== 200) {
      return thunkApi.rejectWithValue({
        errorMessage: "Error fetching the matches",
      });
    }
    return await response.data.data;
  }
);

export const addMatch = createAsyncThunk("cricket/addMatch", async (match) => {
  const response = await api.post("/cricket", match);
  return response;
});

export const cricketSlice = createSlice({
  name: "cricket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllMatches.fulfilled, (state, { payload }) => {
      state.matches = payload;
    });
    builder.addCase(getMatchStats.fulfilled, (state, { payload }) => {
      state.matchStats = payload;
    });
  },
});

// export const {} = cricketSlice.actions;
export default cricketSlice.reducer;

/*
5 RULES FOR SLICE:
INTERFACE INIT_STATE SLICE ASYNC_THUNK EXPORTS
*/
