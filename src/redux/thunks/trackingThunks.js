import {
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
    deleteMedTrackingRecordFailure
} from '../reducers/trackingReducer';
import ChronicAPI from '../../api/chronicAPI';

//thunks to dispatch actions and handle asyncronous API calls for the user tracking section of the store.

export const fetchDaysTracking = (userId, date, slice) => {
    return async (dispatch) => {
        dispatch(fetchDaysTrackingRequest());
        try {
            const symptomTrackingData = await ChronicAPI.getSymptomTrackingRecords(userId, date);
            const medTrackingData = await ChronicAPI.getMedTrackingRecords(userId, date);
            dispatch(fetchDaysTrackingSuccess({slice, symptomTrackingData, medTrackingData}));
        } catch(error) {
            dispatch(fetchDaysTrackingFailure(error.message || 'failed to  load tracking data'));
        }
    }
};

export const createSymptomTrackingRecord = (userId, data, dataForStore) => {
    return async (dispatch) => {
        dispatch(createSymptomTrackingRecordRequest(dataForStore));
        try {
            const symptomTrackingData = await ChronicAPI.createSymptomTrackingRecord(userId, data);
            dispatch(createSymptomTrackingRecordSuccess(symptomTrackingData));
        } catch(error) {
            dispatch(createSymptomTrackingRecordFailure({dataForStore, error: (error.message || 'failed to create tracking record')}));
        }
    }
};

export const editSymptomTrackingRecord = (userId, symtrackId, data, dataForStore) => {
    return async (dispatch) => {
        dispatch(editSymptomTrackingRecordRequest(dataForStore));
        try {
            const symptomTrackingData = await ChronicAPI.updateSeverityLevel(userId, symtrackId, data);
            dispatch(editSymptomTrackingRecordSuccess(symptomTrackingData));
        } catch (error) {
            dispatch(editSymptomTrackingRecordFailure({dataForStore, error: error.message || 'failed to change tracking record'}));
        }
    }
};

export const deleteSymptomTrackingRecord = (userId, symtrackId, dataForStore) => {
    return async (dispatch) => {
        dispatch(deleteSymptomTrackingRecordRequest(dataForStore));
        try {
            const response = await ChronicAPI.deleteSymptomTrackingRecord(userId, symtrackId);
            dispatch(deleteSymptomTrackingRecordSuccess(response));
        } catch(error) {
            dispatch(deleteSymptomTrackingRecordFailure({dataForStore, error: error.message || 'failed to delete tracking record'}));
        }
    }
};

export const createMedTrackingRecord = (userId, data, dataForStore) => {
    return async (dispatch) => {
        dispatch(createMedTrackingRecordRequest(dataForStore));
        try {
            const medTrackingData = await ChronicAPI.createMedTrackingRecord(userId, data);
            dispatch(createMedTrackingRecordSuccess(medTrackingData));
        } catch(error) {
            dispatch(createMedTrackingRecordFailure({dataForStore, error: error.message || 'failed to create tracking record'}));
        }
    }
};

export const editMedTrackingRecord = (userId, medtrackId, data, dataForStore) => {
    return async (dispatch) => {
        dispatch(editMedTrackingRecordRequest(dataForStore));
        try{ 
            const medTrackingData = await ChronicAPI.updateNumber(userId, medtrackId, data);
            dispatch(editMedTrackingRecordSuccess(medTrackingData));
        } catch(error) {
            dispatch(editMedTrackingRecordFailure({dataForStore, error: error.message || 'failed to update tracking record'}));
        }
    }
};

export const deleteMedTrackingRecord = (userId, medtrackId, dataForStore) => {
    return async (dispatch) => {
        dispatch(deleteMedTrackingRecordRequest(dataForStore));
        try{
            const response = await ChronicAPI.deleteMedTrackingRecord(userId, medtrackId);
            dispatch(deleteMedTrackingRecordSuccess(response));
        } catch(error) {
            dispatch(deleteMedTrackingRecordFailure({dataForStore, error: error.message || "faled to delete tracking record"}));
        }
    }
};
