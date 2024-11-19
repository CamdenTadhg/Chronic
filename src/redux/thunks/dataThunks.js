import {
    pullDataRequest, 
    pullDataSuccess,
    pullDataFailure
} from '../reducers/dataReducer';
import ChronicAPI from '../../api/chronicAPI';

//thunks to dispatch actions and handle asyncronous API calls for the data section of the store. 

export const pullData = (symptomData, medData) => {
    return async (dispatch) => {
        dispatch(pullDataRequest());
        try {
            const symptomDataRecords = await ChronicAPI.getSymptomData(symptomData);
            const medDataRecords = await ChronicAPI.getMedData(medData);
            dispatch(pullDataSuccess({symptomDataRecords, medDataRecords}));
        } catch (error) {
            dispatch(pullDataFailure(error.message || 'failed to fetch data'));
        }
    }
};

