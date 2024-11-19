import {createSlice} from '@reduxjs/toolkit';
import {cloneDeep} from 'lodash';
import {logoutAction} from '../actions/logout';

const initialState = {
    primaryTracking: {
        symptoms: {},
        medications: {}
    },
    secondaryTracking: {
        symptoms: {},
        medications: {}
    },
    loading: false,
    error: null,
    history: {}
}

export const trackingSlice = createSlice({
    name: 'tracking', 
    initialState,
    reducers: {
        fetchDaysTrackingRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        fetchDaysTrackingSuccess: (state, action) => {
            state.loading = false;
            state[action.payload.slice].symptoms = action.payload.symptomTrackingData
            state[action.payload.slice].medications = action.payload.medTrackingData
        },
        fetchDaysTrackingFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload
        },
        createSymptomTrackingRecordRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            //create a history snapshot before the new record is added
            state.history = cloneDeep(state[action.payload.slice].symptoms);
            //Update the state with the new symptom severity
            state[action.payload.slice].symptoms[action.payload.symptom][action.payload.timespan] = action.payload.severity;
        },
        createSymptomTrackingRecordSuccess: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        createSymptomTrackingRecordFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            //revert changes to symptom tracking on failure
            state[action.payload.dataForStore.slice].symptoms = cloneDeep(state.history);
            state.history = {};
        },
        editSymptomTrackingRecordRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            //create a history snapshot before the new record is added
            state.history = cloneDeep(state[action.payload.slice].symptoms);
            //Update the state with the new symptom severity
            state[action.payload.slice].symptoms[action.payload.symptom][action.payload.timespan] = action.payload.severity;
        },
        editSymptomTrackingRecordSuccess: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        editSymptomTrackingRecordFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            //revert changes to tracking on failure
            state[action.payload.dataForStore.slice].symptoms = cloneDeep(state.history);
            state.history = {};
        },
        deleteSymptomTrackingRecordRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            //create a history snapshot before the new record is added
            state.history = cloneDeep(state[action.payload.slice].symptoms);
            //Remove the appropriate tracking record from state
            delete state[action.payload.slice].symptoms[action.payload.symptom][action.payload.timespan];
        },
        deleteSymptomTrackingRecordSuccess: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        deleteSymptomTrackingRecordFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            //revert changes to tracking on failure
            state[action.payload.dataForStore.slice].symptoms = cloneDeep(state.history);
            state.history = {};
        },
        createMedTrackingRecordRequest: (state, action) => {            
            state.loading = true;
            state.error = null;
            //create a history snapshot before the new record is added
            state.history = cloneDeep(state[action.payload.slice].medications);
            //Update the state with the new tracking record
            state[action.payload.slice].medications[action.payload.timeOfDay][action.payload.med] = action.payload.number;
        },
        createMedTrackingRecordSuccess: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        createMedTrackingRecordFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            //revert changes to tracking on failure
            state[action.payload.dataForStore.slice].medications = cloneDeep(state.history);
            state.history = {};
        },
        editMedTrackingRecordRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            //create a history snapshot before the record is edited
            state.history = cloneDeep(state[action.payload.slice].medications);
            //Update the state with the new medication number
            state[action.payload.slice].medications[action.payload.timeOfDay][action.payload.med] = action.payload.number;
        },
        editMedTrackingRecordSuccess: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        editMedTrackingRecordFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            //revert changes to tracking on failure
            state[action.payload.dataForStore.slice].medications = cloneDeep(state.history);
            state.history = {};
        },
        deleteMedTrackingRecordRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            //create a history snapshot before the new record is added
            state.history = cloneDeep(state[action.payload.slice].medications);
            //Remove the appropriate tracking record from state
            delete state[action.payload.slice].medications[action.payload.timeOfDay][action.payload.med];
        },
        deleteMedTrackingRecordSuccess: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        deleteMedTrackingRecordFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            //revert changes to tracking on failure
            state[action.payload.dataForStore.slice].medications = cloneDeep(state.history);
            state.history = {};
        },
        connectSymptomRequestTracking: (state, action) => {
            state.loading = true;
            state.history.primaryTracking = cloneDeep(state.primaryTracking.symptoms);
            state.history.secondaryTracking = cloneDeep(state.secondaryTracking.symptoms)
            state.primaryTracking.symptoms[action.payload.symptom] = {};
            state.secondaryTracking.symptoms[action.payload.symptom] = {};
        },
        connectSymptomSuccessTracking: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        connectSymptomFailureTracking: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.primaryTracking.symptoms = cloneDeep(state.history.primaryTracking);
            state.secondaryTracking.symptoms = cloneDeep(state.history.secondaryTracking);
            state.history = {};
        },
        changeSymptomRequestTracking: (state, action) => {
            state.loading = true;
            state.history.primaryTracking = cloneDeep(state.primaryTracking.symptoms);
            state.history.secondaryTracking = cloneDeep(state.secondaryTracking.symptoms);
            //temporarily store current tracking records for old symptom name
            let temp = state.primaryTracking.symptoms[action.payload.oldSymptom];
            //remove old symptom name from the object
            delete state.primaryTracking.symptoms[action.payload.oldSymptom];
            //enter new symptom name in the object and assign current tracking records
            state.primaryTracking.symptoms[action.payload.newSymptom] = temp;
            temp = state.secondaryTracking.symptoms[action.payload.oldSymptom];
            delete state.secondaryTracking.symptoms[action.payload.oldSymptom];
            state.secondaryTracking.symptoms[action.payload.newSymptom] = temp;
        },
        changeSymptomSuccessTracking: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        changeSymptomFailureTracking: (state, action) => {
            state.loading = false;
            state.error = action.payload
            state.primaryTracking.symptoms = cloneDeep(state.history.primaryTracking);
            state.secondaryTracking.symptoms = cloneDeep(state.history.secondaryTracking)
            state.history = {};
        },
        disconnectFromSymptomRequestTracking: (state, action) => {
            state.loading = true;
            state.history.primaryTracking = cloneDeep(state.primaryTracking.symptoms);
            state.history.secondaryTracking = cloneDeep(state.secondaryTracking.symptoms);
            delete state.primaryTracking.symptoms[action.payload.symptom];
            delete state.secondaryTracking.symptoms[action.payload.symptom];
        },
        disconnectFromSymptomSuccessTracking: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        disconnectFromSymptomFailureTracking: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.primaryTracking.symptoms = cloneDeep(state.history.primaryTracking);
            state.secondaryTracking.symptoms = cloneDeep(state.history.secondaryTracking)
            state.history = {};
        },
        connectMedRequestTracking: (state, action) => {
            state.loading = true;
            state.history.primaryTracking = cloneDeep(state.primaryTracking.medications);
            state.history.secondaryTracking = cloneDeep(state.secondaryTracking.medications);
            for (let time of action.payload.timeOfDay){
                state.primaryTracking.medications[time][action.payload.medication] = null;
                state.secondaryTracking.medications[time][action.payload.medication] = null;
            }
        },
        connectMedSuccessTracking: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        connectMedFailureTracking: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.primaryTracking.medications = cloneDeep(state.history.primaryTracking);
            state.secondaryTracking.medications = cloneDeep(state.history.secondaryTracking);
            state.history = {};
        },
        changeMedRequestTracking: (state, action) => {
            state.loading = true;
            state.history.primaryTracking = cloneDeep(state.primaryTracking.medications);
            state.history.secondaryTracking = cloneDeep(state.secondaryTracking.medications);
            let timesOfDay = ['AM', 'Midday', 'PM', 'Evening'];
            for (let time of timesOfDay){
                if (state.primaryTracking.medications[time][action.payload.oldMedication]){
                    if(action.payload.timeOfDay.includes(time)){
                        let temp = state.primaryTracking.medications[time][action.payload.oldMedication];
                        delete state.primaryTracking.medications[time][action.payload.oldMedication];
                        state.primaryTracking.medications[time][action.payload.newMedication] = temp;
                        temp = state.secondaryTracking.medications[time][action.payload.oldMedication];
                        delete state.secondaryTracking.medications[time][action.payload.oldMedication];
                        state.secondaryTracking.medications[time][action.payload.newMedication] = temp;
                    } else {
                        delete state.primaryTracking.medications[time][action.payload.oldMedication];
                        delete state.secondaryTracking.medications[time][action.payload.oldMedication]
                    }
                } else {
                    if (action.payload.timeOfDay.includes(time)){
                        state.primaryTracking.medications[time][action.payload.newMedication] = null;
                        state.secondaryTracking.medications[time][action.payload.newMedication] = null;
                    }
                }
            }
        },
        changeMedSuccessTracking: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        changeMedFailureTracking: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.primaryTracking.medications = cloneDeep(state.history.primaryTracking);
            state.secondaryTracking.medications = cloneDeep(state.history.secondaryTracking);
            state.history = {};
        }, 
        disconnectFromMedRequestTracking: (state, action) => {
            state.loading = true;
            state.history.primaryTracking = cloneDeep(state.primaryTracking.medications);
            state.history.secondaryTracking = cloneDeep(state.secondaryTracking.medications);
            let timesOfDay = ['AM', 'Midday', 'PM', 'Evening'];
            for (let time of timesOfDay){
                if (state.primaryTracking.medications[time][action.payload.medication]){
                    delete state.primaryTracking.medications[time][action.payload.medication];
                    delete state.secondaryTracking.medications[time][action.payload.medication];
                }
            }
        },
        disconnectFromMedSuccessTracking: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        disconnectFromMedFailureTracking: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.primaryTracking.medications = cloneDeep(state.history.primaryTracking);
            state.secondaryTracking.medications = cloneDeep(state.history.secondaryTracking);
            state.history = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(logoutAction, (state, action) => {
                state.primaryTracking.symptoms = {};
                state.primaryTracking.medications = {};
                state.secondaryTracking.symptoms = {};
                state.secondaryTracking.medications = {};
                state.loading = false;
                state.error = null;
                state.history = {};
            });
    }
});

export const {
    fetchDaysTrackingRequest,
    fetchDaysTrackingSuccess,
    fetchDaysTrackingFailure,
    createSymptomTrackingRecordRequest,
    createSymptomTrackingRecordSuccess,
    createSymptomTrackingRecordFailure,
    editSymptomTrackingRecordRequest,
    editSymptomTrackingRecordSuccess,
    editSymptomTrackingRecordFailure,
    deleteSymptomTrackingRecordRequest,
    deleteSymptomTrackingRecordSuccess,
    deleteSymptomTrackingRecordFailure,
    createMedTrackingRecordRequest,
    createMedTrackingRecordSuccess,
    createMedTrackingRecordFailure,
    editMedTrackingRecordRequest,
    editMedTrackingRecordSuccess,
    editMedTrackingRecordFailure,
    deleteMedTrackingRecordRequest,
    deleteMedTrackingRecordSuccess,
    deleteMedTrackingRecordFailure,
    connectSymptomRequestTracking,
    connectSymptomSuccessTracking,
    connectSymptomFailureTracking,
    changeSymptomRequestTracking,
    changeSymptomSuccessTracking,
    changeSymptomFailureTracking,
    disconnectFromSymptomRequestTracking,
    disconnectFromSymptomSuccessTracking,
    disconnectFromSymptomFailureTracking,
    connectMedRequestTracking,
    connectMedSuccessTracking,
    connectMedFailureTracking,
    changeMedRequestTracking,
    changeMedSuccessTracking,
    changeMedFailureTracking,
    disconnectFromMedRequestTracking,
    disconnectFromMedSuccessTracking,
    disconnectFromMedFailureTracking
} = trackingSlice.actions;
export default trackingSlice.reducer;