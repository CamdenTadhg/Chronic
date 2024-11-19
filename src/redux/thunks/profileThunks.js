import {
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
} from '../reducers/profileReducer';
import {
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
} from '../reducers/trackingReducer';
import ChronicAPI from '../../api/chronicAPI';

//thunks to dispatch actions and handle asyncronous API calls for the user profile section of the store. 

export const fetchUserProfile = (userId) => {
    return async (dispatch) => {
        dispatch(fetchProfileRequest());
        try{
            const userData = await ChronicAPI.getUser(userId);
            dispatch(fetchProfileSuccess(userData));
        } catch (error) {
            dispatch(fetchProfileFailure(error.message || 'failed to fetch profile data'));
        }
}};

export const editUserProfile = (userId, data) => {
    return async (dispatch) => {
        dispatch(updateProfileRequest(data));
        try {
            const userData = await ChronicAPI.editUser(userId, data);
            dispatch(updateProfileSuccess());
        } catch (error) {
            dispatch(updateProfileFailure(error || 'failed to update profile data'));
        }
    }
};

export const deleteUserProfile = (userId) => {
    return async (dispatch) => {
        dispatch(deleteProfileRequest());
        try {
            const message = await ChronicAPI.deleteUser(userId);
            dispatch(deleteProfileSuccess(message));
        } catch (error) {
            dispatch(deleteProfileFailure(error.message || 'failed to delete profile'));
        }
    }
};

export const connectDiagnosis = (userId, diagnosisId, data, dataForStore) => {
    return async (dispatch) => {
        dispatch(connectDiagnosisRequest(dataForStore));
        try{
            const userDiagnosisData = await ChronicAPI.connectUserDiagnosis(diagnosisId, userId, data);
            dispatch(connectDiagnosisSuccess(userDiagnosisData));
        } catch (error) {
            dispatch(connectDiagnosisFailure(error || 'failed to add diagnosis'));
        }
    }
};

export const updateUserDiagnosis = (userId, diagnosisId, data, dataForStore) => {
    return async (dispatch) => {
        dispatch(updateUserDiagnosisRequest(dataForStore));
        try {
            const userDiagnosisData = await ChronicAPI.updateUserDiagnosis(diagnosisId, userId, data);
            dispatch(updateUserDiagnosisSuccess(userDiagnosisData));
        } catch (error) {
            dispatch(updateUserDiagnosisFailure(error || 'failed to edit user diagnosis'));
        }
    }
};

export const disconnectFromDiagnosis = (userId, diagnosisId, dataForStore) => {
    return async (dispatch) => {
        dispatch(disconnectFromDiagnosisRequest(dataForStore));
        try {
            const response = await ChronicAPI.disconnectUserDiagnosis(diagnosisId, userId);
            dispatch(disconnectFromDiagnosisSuccess(response));
        } catch(error) {
            dispatch(disconnectFromDiagnosisFailure(error || 'failed to remove diagnosis'));
        }
    }
};

export const connectSymptom = (userId, symptomId, data, dataForStore) => {
    return async (dispatch) => {
        dispatch(connectSymptomRequest(dataForStore));
        dispatch(connectSymptomRequestTracking(dataForStore));
        try {
            const userSymptomData = await ChronicAPI.connectUserSymptom(symptomId, userId, data);
            dispatch(connectSymptomSuccess(userSymptomData));
            dispatch(connectSymptomSuccessTracking(userSymptomData));
        } catch(error) {
            dispatch(connectSymptomFailure(error.message || 'failed to remove diagnosis'));
            dispatch(connectSymptomFailureTracking());
        }
    }
};

export const changeSymptom = (userId, symptomId, data, dataForStore) => {
    return async (dispatch) => {
        dispatch(changeSymptomRequest(dataForStore));
        dispatch(changeSymptomRequestTracking(dataForStore));
        try {
            const userSymptomData = await ChronicAPI.changeUserSymptom(symptomId, userId, data);
            dispatch(changeSymptomSuccess(userSymptomData));
            dispatch(changeSymptomSuccessTracking(userSymptomData));
        } catch(error) {
            dispatch(changeSymptomFailure(error.message || 'failed to edit symptom'))
            dispatch(changeSymptomFailureTracking());
        }
    }
};

export const disconnectSymptom = (userId, symptomId, dataForStore) => {
    return async (dispatch) => {
        dispatch(disconnectFromSymptomRequest(dataForStore));
        dispatch(disconnectFromSymptomRequestTracking(dataForStore));
        try {
            const response = await ChronicAPI.disconnectUserSymptom(symptomId, userId);
            dispatch(disconnectFromSymptomSuccess(response));
            dispatch(disconnectFromSymptomSuccessTracking(response));
        } catch(error) {
            dispatch(disconnectFromSymptomFailure(error.message || 'failed to delete symptom'));
            dispatch(disconnectFromSymptomFailureTracking());
        }
    }
};

export const connectMed = (userId, medId, data, dataForStore) => {
    return async (dispatch) => {
        dispatch(connectMedRequest(dataForStore));
        dispatch(connectMedRequestTracking(dataForStore));
        try {
            const userMedData = await ChronicAPI.connectUserMedication(medId, userId, data);
            dispatch(connectMedSuccess(userMedData));
            dispatch(connectMedSuccessTracking(userMedData));
        } catch(error) {
            dispatch(connectMedFailure(error.message || 'failed to add medication'));
            dispatch(connectMedFailureTracking());
        }
    }
};

export const changeMed = (userId, medId, data, dataForStore) => {
    return async (dispatch) => {
        dispatch(changeMedRequest(dataForStore));
        dispatch(changeMedRequestTracking(dataForStore));
        try {
            const userMedData = await ChronicAPI.changeUserMedication(medId, userId, data);
            dispatch(changeMedSuccess(userMedData));
            dispatch(changeMedSuccessTracking(userMedData));
        } catch(error) {
            dispatch(changeMedFailure(error.message || 'failed to edit medication'));
            dispatch(changeMedFailureTracking());
        }
    }
};

export const disconnectMed = (userId, medId, dataForStore) => {
    return async (dispatch) => {
        dispatch(disconnectFromMedRequest(dataForStore));
        dispatch(disconnectFromMedRequestTracking(dataForStore));
        try {
            const response = await ChronicAPI.disconnectUserMedication(medId, userId);
            dispatch(disconnectFromMedSuccess(response));
            dispatch(disconnectFromMedSuccessTracking(response));
        } catch (error) {
            dispatch(disconnectFromMedFailure(error.message || 'failed to delete medication'));
            dispatch(disconnectFromMedFailureTracking());
        }
    }
};
