import { createSlice } from "@reduxjs/toolkit";
import { dummyWorkspaces } from "../assets/assets";

const initialState = {
  workspaces: dummyWorkspaces || [],
  currentWorkspace: dummyWorkspaces[1],
  loading: false,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    },
    setCurrentWorkspace: (state, action) => {
      localStorage.setItem("currentWorkspaceId", action.payload);
      state.currentWorkspace = state.workspaces.find(
        (w) => (w.id = action.payload),
      );
    },
    addWorkspace: (state, action) => {
        state.workspaces.push(action.payload)
        if(state.currentWorkspace?.id !== action.payload.id){
            state.currentWorkspace = action.payload
        }
    },
    updateWorkspace: (state, action) => {
        state.workspaces = state.workspaces
    }
  },
});
