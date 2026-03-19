import {configureStore} from "@reduxjs/toolkit"
import workspaceReducer from "../features/worksoaceSlice"
import themeReduce from "../features/themeSlice"

export const store = configureStore({
    reducer: {
        workspace: workspaceReducer,
        theme: themeReduce,
    }
})