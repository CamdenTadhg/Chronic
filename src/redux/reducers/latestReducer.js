import {createSlice} from '@reduxjs/toolkit';
import {logoutAction} from '../actions/logout'

const initialState = {
    articleIds: [],
    loading: true,
    error: null
}

export const latestSlice = createSlice({
    name: 'latest', 
    initialState,
    reducers: {
        fetchLatestRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        fetchLatestSuccess: (state, action) => {
            state.loading = false;
            state.articleIds = action.payload;
        },
        fetchLatestFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(logoutAction, (state, action) => {
                state.articleIds = [];
                state.loading = true;
                state.error = null;
            });
    }
});

export const {
    fetchLatestRequest,
    fetchLatestSuccess,
    fetchLatestFailure
} = latestSlice.actions;
export default latestSlice.reducer;