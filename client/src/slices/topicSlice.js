import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../apiClient/axios";

const initialState = {
  topics: [],
  availableTopics: [],
  myTopics: [],
  selectedTopic: null,
  selectedTopicData: null,
  advertisement: null,
};

export const getAllTopics = createAsyncThunk(
  "cricket/getAllTopics",
  async (thunkApi) => {
    const response = await api.get("/topic/all");
    if (response.status !== 200) {
      return thunkApi.rejectWithValue({
        errorMessage: "Error fetching the topics",
      });
    }
    return response.data.data;
  }
);

export const getAvailableTopics = createAsyncThunk(
  "cricket/getAvailableTopics",
  async (email, thunkApi) => {
    const response = await api.get("/user/" + email + "/topic/available");
    if (response.status !== 200) {
      return thunkApi.rejectWithValue({
        errorMessage: "Error fetching the available topics",
      });
    }
    return response.data.data;
  }
);

export const getMyTopics = createAsyncThunk(
  "cricket/getMyTopics",
  async (email, thunkApi) => {
    const response = await api.get("/user/" + email + "/topic/subscribed");
    if (response.status !== 200) {
      return thunkApi.rejectWithValue({
        errorMessage: "Error fetching the subscribed topics",
      });
    }
    return response.data.data;
  }
);

export const subscribeTopic = createAsyncThunk(
  "cricket/subscribeTopic",
  async ({ email, topicId }, thunkApi) => {
    const response = await api.get(
      "/user/" + email + "/topic/" + topicId + "/subscribe"
    );
    if (response.status !== 200) {
      return thunkApi.rejectWithValue({
        errorMessage: "Error subscribing the topic",
      });
    }
    thunkApi.dispatch(getAvailableTopics(email));
    thunkApi.dispatch(getMyTopics(email));
    return true;
  }
);

export const unsubscribeTopic = createAsyncThunk(
  "cricket/unsubscribeTopic",
  async ({ email, topicId }, thunkApi) => {
    const response = await api.get(
      "/user/" + email + "/topic/" + topicId + "/unsubscribe"
    );
    if (response.status !== 200) {
      return thunkApi.rejectWithValue({
        errorMessage: "Error unubscribing the topic",
      });
    }
    thunkApi.dispatch(getAvailableTopics(email));
    thunkApi.dispatch(getMyTopics(email));
    return true;
  }
);

export const topic = createSlice({
  name: "topic",
  initialState,
  reducers: {
    selectTopic: (state, { payload }) => {
      state.selectedTopic = payload;
    },
    addSelectedTopicData: (state, { payload }) => {
      state.selectedTopicData = payload;
    },
    resetSelectedTopicData: (state) => {
      state.selectedTopicData = null;
    },
    addAdvertisement: (state, { payload }) => {
      state.advertisement = payload;
    },
    resetAdvertisement: (state) => {
      state.advertisement = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllTopics.fulfilled, (state, { payload }) => {
      state.topics = payload;
    });
    builder.addCase(getAvailableTopics.fulfilled, (state, { payload }) => {
      state.availableTopics = payload;
    });
    builder.addCase(getMyTopics.fulfilled, (state, { payload }) => {
      state.myTopics = payload;
    });
  },
});

export const {
  selectTopic,
  addSelectedTopicData,
  addAdvertisement,
  resetAdvertisement,
  resetSelectedTopicData,
} = topic.actions;
export default topic.reducer;
