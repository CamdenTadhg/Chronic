import {createSlice} from '@reduxjs/toolkit';
import {logoutAction} from '../actions/logout';

const initialState = {
    symptoms: {},
    medications: {},
    loading: false,
    error: null
}

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        pullDataRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        pullDataSuccess: (state, action) => {
            state.loading = false;
            state.symptoms = action.payload.symptomDataRecords;
            state.medications = action.payload.medDataRecords;
        },
        pullDataFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(logoutAction, (state, action) => {
                state.symptoms = {};
                state.medications = {};
                state.loading = false;
                state.error = null;
            })
    }
});

export const {
    pullDataRequest,
    pullDataSuccess,
    pullDataFailure
} = dataSlice.actions;
export default dataSlice.reducer;