import {createSlice} from '@reduxjs/toolkit';
import {cloneDeep} from 'lodash';
import {logoutAction} from '../actions/logout';

const initialState = {
    userId: null,
    email: '',
    name: '',
    isAdmin: false,
    since: '',
    lastLogin: '',
    diagnoses: [],
    symptoms: [],
    medications: [],
    loading: false,
    error: null,
    history: {}
}

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        fetchProfileRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        fetchProfileSuccess: (state, action) => {
            state.loading = false;
            Object.assign(state, action.payload);
        },
        fetchProfileFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateProfileRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            //save potentially changed values in history
            state.history = {
                email: state.email,
                name: state.name,
            }
            Object.assign(state, action.payload);
            if (state.password){
                delete state.password;
            }
        },
        updateProfileSuccess: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        updateProfileFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            //revert values on failure
            Object.assign(state, state.history);
            state.history = {};
        },
        deleteProfileRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        deleteProfileSuccess: (state, action) => {
            state.loading = false;
            Object.assign(state, initialState);
        },
        deleteProfileFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload
        },
        connectDiagnosisRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            let newDiagnosis = {
                diagnosis: action.payload.diagnosis,
                keywords: action.payload.keywords
            }
            state.diagnoses.push(newDiagnosis);
        },
        connectDiagnosisSuccess: (state, action) => {
            state.loading = false;
            const index = state.diagnoses.length - 1;
            state.diagnoses[index].diagnosisId = action.payload.diagnosisId;

        },
        connectDiagnosisFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            //revert values on failure
            state.diagnoses.pop();
        },
        updateUserDiagnosisRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            //save changed values to history
            state.history.diagnoses = cloneDeep(state.diagnoses);
            const index = state.diagnoses.findIndex(object => object.diagnosis === action.payload.diagnosis);
            if (index !== -1) {
                if (state.diagnoses[index].keywords === null){
                    state.diagnoses[index].keywords = [];
                }
                for (let keyword of action.payload.keywords){
                    state.diagnoses[index].keywords.push(keyword);
                }
            }
        },
        updateUserDiagnosisSuccess: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        updateUserDiagnosisFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            //revert values on failure
            state.diagnoses = cloneDeep(state.history.diagnoses);
            state.history = {}
        },
        disconnectFromDiagnosisRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            //save changed values to history
            state.history.diagnoses = cloneDeep(state.diagnoses);
            state.diagnoses = state.diagnoses.filter((object) => object.diagnosisId !== action.payload.diagnosisId);
        },
        disconnectFromDiagnosisSuccess: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        disconnectFromDiagnosisFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            //revert values on failure
            state.diagnoses = cloneDeep(state.history.diagnoses);
            state.history = {};
        },
        connectSymptomRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            let newSymptom = action.payload.symptom
            state.symptoms.push(newSymptom);
        },
        connectSymptomSuccess: (state, action) => {
            state.loading = false;
        },
        connectSymptomFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            //revert values on failure
            state.symptoms.pop();
        },
        changeSymptomRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            //save changed values to history
            state.history.symptoms = cloneDeep(state.symptoms);
            state.symptoms = state.symptoms.filter((symptom) => symptom !== action.payload.oldSymptom);
            state.symptoms.push(action.payload.newSymptom);
        },
        changeSymptomSuccess: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        changeSymptomFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            //revert values on failure
            state.symptoms = cloneDeep(state.history.symptoms);
            state.history = {};
        },
        disconnectFromSymptomRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            //save changed values to history
            state.history.symptoms = cloneDeep(state.symptoms);
            state.symptoms = state.symptoms.filter((value) => value !== action.payload.symptom);
        },
        disconnectFromSymptomSuccess: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        disconnectFromSymptomFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            //revert values on failure
            state.symptoms = cloneDeep(state.history.symptoms);
            state.history = {};
        },
        connectMedRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            let newMed = {
                medication: action.payload.medication,
                dosageNum: action.payload.dosageNum,
                dosageUnit: action.payload.dosageUnit,
                timeOfDay: action.payload.timeOfDay
            };
            state.medications.push(newMed);
        },
        connectMedSuccess: (state, action) => {
            state.loading = false;
        },
        connectMedFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            //revert values on failure
            state.medications.pop();
        },
        changeMedRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            //save changed values to history
            state.history.medications = cloneDeep(state.medications);
            state.medications = state.medications.filter((object) => object.medication !== action.payload.oldMed);
            state.medications.push(action.payload.newMed);
        },
        changeMedSuccess: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        changeMedFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            //revert values on failure
            state.medications = cloneDeep(state.history.medications);
            state.history = {};
        },
        disconnectFromMedRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            //save changed values to history
            state.history.medications = cloneDeep(state.medications);
            state.medications = state.medications.filter((object) => object.medication !== action.payload.medication);
        },
        disconnectFromMedSuccess: (state, action) => {
            state.loading = false;
            state.history = {};
        },
        disconnectFromMedFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            //revert values on failure
            state.medications = cloneDeep(state.history.medications);
            state.history = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(logoutAction, (state, action) => {
                state.userId = null;
                state.email = '';
                state.name = '';
                state.isAdmin = false;
                state.lastLogin = '';
                state.diagnoses = [];
                state.symptoms = [];
                state.medications = [];
                state.loading = false;
                state.error = null;
                state.history = {}
            });
    }
});

export const {
    fetchProfileRequest,
    fetchProfileSuccess,
    fetchProfileFailure,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFailure,
    deleteProfileRequest,
    deleteProfileSuccess,
    deleteProfileFailure,
    connectDiagnosisRequest,
    connectDiagnosisSuccess,
    connectDiagnosisFailure,
    updateUserDiagnosisRequest,
    updateUserDiagnosisSuccess,
    updateUserDiagnosisFailure,
    disconnectFromDiagnosisRequest,
    disconnectFromDiagnosisSuccess,
    disconnectFromDiagnosisFailure,
    connectSymptomRequest,
    connectSymptomSuccess,
    connectSymptomFailure,
    changeSymptomRequest,
    changeSymptomSuccess,
    changeSymptomFailure,
    disconnectFromSymptomRequest,
    disconnectFromSymptomSuccess,
    disconnectFromSymptomFailure,
    connectMedRequest,
    connectMedSuccess,
    connectMedFailure,
    changeMedRequest,
    changeMedSuccess,
    changeMedFailure,
    disconnectFromMedRequest,
    disconnectFromMedSuccess,
    disconnectFromMedFailure
} = profileSlice.actions;
export default profileSlice.reducer;
