import {
    fetchUserProfile,
    editUserProfile,
    deleteUserProfile,
    connectDiagnosis,
    updateUserDiagnosis,
    disconnectFromDiagnosis,
    connectSymptom,
    changeSymptom,
    disconnectSymptom,
    connectMed,
    changeMed,
    disconnectMed
} from '../profileThunks';
import {describe, it, expect, vi} from 'vitest';

vi.mock('../../../api/chronicAPI', () => {
    return {
        default: {
            getUser: vi.fn(),
            editUser: vi.fn(),
            deleteUser: vi.fn(),
            connectUserDiagnosis: vi.fn(),
            updateUserDiagnosis: vi.fn(),
            disconnectUserDiagnosis: vi.fn(),
            connectUserSymptom: vi.fn(),
            changeUserSymptom: vi.fn(),
            disconnectUserSymptom: vi.fn(),
            connectUserMedication: vi.fn(),
            changeUserMedication: vi.fn(),
            disconnectUserMedication: vi.fn()
        }
    }
});

import ChronicAPI from '../../../api/chronicAPI';


describe('fetchUserProfile', () => {
    it('dispatches correct actions on successful request', async () => {
        ChronicAPI.getUser.mockResolvedValue({id: 1, name: 'John Doe'});
        const dispatch = vi.fn();
        await fetchUserProfile(1)(dispatch);

        expect(dispatch).toHaveBeenCalledWith({type: 'profile/fetchProfileRequest'});
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/fetchProfileSuccess',
            payload: {id: 1, name: 'John Doe'}
        });
    });
    it('dispatches correct actions on error', async () => {
        ChronicAPI.getUser.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await fetchUserProfile(1)(dispatch);

        expect(dispatch).toHaveBeenCalledWith({type: 'profile/fetchProfileRequest'});
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/fetchProfileFailure',
            payload: 'I am an error message'
        });
    });
});

describe('editUserProfile', () => {
    it('dispatches correct actions on successful request', async () => {
        ChronicAPI.editUser.mockResolvedValue({id: 1, name: 'John Doe'});
        const dispatch = vi.fn();
        await editUserProfile(1, {email: 'test@test.com'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/updateProfileRequest',
            payload: {email: 'test@test.com'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/updateProfileSuccess'
        });
    });
    it('dispatches correct actions on error', async () => {
        ChronicAPI.editUser.mockRejectedValue('I am an error message');
        const dispatch = vi.fn();
        await editUserProfile(1, {email: 'test@test.com'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/updateProfileRequest',
            payload: {email: 'test@test.com'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/updateProfileFailure',
            payload: 'I am an error message'
        });
    });
});

describe('deleteUserProfile', () => {
    it('dispatches correct actions on successful request', async () => {
        ChronicAPI.deleteUser.mockResolvedValue('User 1 deleted');
        const dispatch = vi.fn();
        await deleteUserProfile(1)(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/deleteProfileRequest'
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/deleteProfileSuccess',
            payload: 'User 1 deleted'
        });
    });
    it('dispatches correct actions on error', async () => {
        ChronicAPI.deleteUser.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await deleteUserProfile(1)(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/deleteProfileRequest'
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/deleteProfileFailure',
            payload: 'I am an error message'
        });
    });
});

describe('connectDiagnosis', () => {
    it('dispatches correct actions on successful request', async () => {
        ChronicAPI.connectUserDiagnosis.mockResolvedValue({userId: 1, diagnosisId: 1});
        const dispatch = vi.fn();
        await connectDiagnosis(1, 1, {keywords: ['pain']}, {diagnosis: 'fibromyalgia'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/connectDiagnosisRequest',
            payload: {diagnosis: 'fibromyalgia'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/connectDiagnosisSuccess',
            payload: {userId: 1, diagnosisId: 1}
        });
    });
    it('dispatches correct actions on error', async () => {
        ChronicAPI.connectUserDiagnosis.mockRejectedValue('I am an error message');
        const dispatch = vi.fn();
        await connectDiagnosis(1, 1, {keywords: ['pain']}, {diagnosis: 'fibromyalgia'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/connectDiagnosisRequest',
            payload: {diagnosis: 'fibromyalgia'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/connectDiagnosisFailure',
            payload: 'I am an error message'
        });
    });
});

describe('updateUserDiagnosis', () => {
    it('dispatches correct actions on successful request', async () => {
        ChronicAPI.updateUserDiagnosis.mockResolvedValue({userId: 1, diagnosisId: 1});
        const dispatch = vi.fn();
        await updateUserDiagnosis(1, 1, {keywords: ['pain']}, {diagnosis: 'fibromyalgia'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/updateUserDiagnosisRequest',
            payload: {diagnosis: 'fibromyalgia'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/updateUserDiagnosisSuccess',
            payload: {userId: 1, diagnosisId: 1}
        });
    });
    it('dispatches correct actions on error', async () => {
        ChronicAPI.updateUserDiagnosis.mockRejectedValue('I am an error message');
        const dispatch = vi.fn();
        await updateUserDiagnosis(1, 1, {keywords: ['pain']}, {diagnosis: 'fibromyalgia'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/updateUserDiagnosisRequest',
            payload: {diagnosis: 'fibromyalgia'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/updateUserDiagnosisFailure',
            payload: 'I am an error message'
        });
    });
});

describe('disconnectFromDiagnosis', () => {
    it('dispatches correct actions on successful request', async () => {
        ChronicAPI.disconnectUserDiagnosis.mockResolvedValue({disconnected: ['Diagnosis 1', 'User 1']});
        const dispatch = vi.fn();
        await disconnectFromDiagnosis(1, 1, {diagnosis: 'fibromyalgia'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/disconnectFromDiagnosisRequest',
            payload: {diagnosis: 'fibromyalgia'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/disconnectFromDiagnosisSuccess',
            payload: {disconnected: ['Diagnosis 1', 'User 1']}
        });
    });
    it('dispatches correct actions on error', async () => {
        ChronicAPI.disconnectUserDiagnosis.mockRejectedValue('I am an error message');
        const dispatch = vi.fn();
        await disconnectFromDiagnosis(1, 1, {diagnosis: 'fibromyalgia'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/disconnectFromDiagnosisRequest',
            payload: {diagnosis: 'fibromyalgia'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/disconnectFromDiagnosisFailure',
            payload: 'I am an error message'
        });
    });
});

describe('connectSymptom', () => {
    it('dispatches correct actions on successful request', async () => {
        ChronicAPI.connectUserSymptom.mockResolvedValue({userId: 1, symptomId: 1});
        const dispatch = vi.fn();
        await connectSymptom(1, 1, {}, {symptom: 'pain'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/connectSymptomRequest',
            payload: {symptom: 'pain'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/connectSymptomRequestTracking',
            payload: {symptom: 'pain'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/connectSymptomSuccess',
            payload: {userId: 1, symptomId: 1}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/connectSymptomSuccessTracking',
            payload: {userId: 1, symptomId: 1}
        });
    });
    it('dispatches correct actions on error', async () => {
        ChronicAPI.connectUserSymptom.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await connectSymptom(1, 1, {}, {symptom: 'pain'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/connectSymptomRequest',
            payload: {symptom: 'pain'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/connectSymptomRequestTracking',
            payload: {symptom: 'pain'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/connectSymptomFailure',
            payload: 'I am an error message'
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/connectSymptomFailureTracking'
        });
    });
});

describe('changeSymptom', () => {
    it('dispatches correct actions on successful request', async () => {
        ChronicAPI.changeUserSymptom.mockResolvedValue({userId: 1, symptomId: 1});
        const dispatch = vi.fn();
        await changeSymptom(1, 1, {newSymptom: 'fatigue'}, {oldSymptom: 'pain', newSymptom: 'fatigue'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/changeSymptomRequest',
            payload: {oldSymptom: 'pain', newSymptom: 'fatigue'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/changeSymptomRequestTracking',
            payload: {oldSymptom: 'pain', newSymptom: 'fatigue'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/changeSymptomSuccess',
            payload: {userId: 1, symptomId: 1}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/changeSymptomSuccessTracking',
            payload: {userId: 1, symptomId: 1}
        });
    });
    it('dispatches correct actions on error', async () => {
        ChronicAPI.changeUserSymptom.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await changeSymptom(1, 1, {newSymptom: 'fatigue'}, {oldSymptom: 'pain', newSymptom: 'fatigue'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/changeSymptomRequest',
            payload: {oldSymptom: 'pain', newSymptom: 'fatigue'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/changeSymptomRequestTracking',
            payload: {oldSymptom: 'pain', newSymptom: 'fatigue'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/changeSymptomFailure',
            payload: 'I am an error message'
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/changeSymptomFailureTracking'
        });
    });
});

describe('disconnectSymptom', () => {
    it('dispatches correct actions on successful request', async () => {
        ChronicAPI.disconnectUserSymptom.mockResolvedValue({disconnected: ['User 1', 'Symptom 1']});
        const dispatch = vi.fn();
        await disconnectSymptom(1, 1, {symptom: 'pain'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/disconnectFromSymptomRequest',
            payload: {symptom: 'pain'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/disconnectFromSymptomRequestTracking',
            payload: {symptom: 'pain'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/disconnectFromSymptomSuccess',
            payload: {disconnected: ['User 1', 'Symptom 1']}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/disconnectFromSymptomSuccessTracking',
            payload: {disconnected: ['User 1', 'Symptom 1']}
        });
    });
    it('dispatches correct actions on error', async () => {
        ChronicAPI.disconnectUserSymptom.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await disconnectSymptom(1, 1, {symptom: 'pain'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/disconnectFromSymptomRequest',
            payload: {symptom: 'pain'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/disconnectFromSymptomRequestTracking',
            payload: {symptom: 'pain'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/disconnectFromSymptomFailure',
            payload: 'I am an error message'
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/disconnectFromSymptomFailureTracking'
        });
    });
});

describe('connectMed', () => {
    it('dispatches correct actions on successful request', async () => {
        ChronicAPI.connectUserMedication.mockResolvedValue({userId: 1, medId: 1});
        const dispatch = vi.fn();
        await connectMed(1, 0, {medication: 'tylenol'}, {medication: 'tylenol'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/connectMedRequest',
            payload: {medication: 'tylenol'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/connectMedRequestTracking',
            payload: {medication: 'tylenol'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/connectMedSuccess',
            payload: {userId: 1, medId: 1}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/connectMedSuccessTracking',
            payload: {userId: 1, medId: 1}
        });
    });
    it('dispatches correct actions on error', async () => {
        ChronicAPI.connectUserMedication.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await connectMed(1, 0, {medication: 'tylenol'}, {medication: 'tylenol'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/connectMedRequest',
            payload: {medication: 'tylenol'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/connectMedRequestTracking',
            payload: {medication: 'tylenol'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/connectMedFailure',
            payload: 'I am an error message'
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/connectMedFailureTracking'
        });
    });
});

describe('changeMed', () => {
    it('dispatches correct actions on successful request', async () => {
        ChronicAPI.changeUserMedication.mockResolvedValue({userId: 1, medId: 1});
        const dispatch = vi.fn();
        await changeMed(1, 1, {newMedication: 'tylenol'}, {oldMedication: 'M1', newMedication: 'tylenol'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/changeMedRequest',
            payload: {oldMedication: 'M1', newMedication: 'tylenol'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/changeMedRequestTracking',
            payload: {oldMedication: 'M1', newMedication: 'tylenol'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/changeMedSuccess',
            payload: {userId: 1, medId: 1}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/changeMedSuccessTracking',
            payload: {userId: 1, medId: 1}
        });
    });
    it('dispatches correct actions on error', async () => {
        ChronicAPI.changeUserMedication.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await changeMed(1, 1, {newMedication: 'tylenol'}, {oldMedication: 'M1', newMedication: 'tylenol'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/changeMedRequest',
            payload: {oldMedication: 'M1', newMedication: 'tylenol'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/changeMedRequestTracking',
            payload: {oldMedication: 'M1', newMedication: 'tylenol'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/changeMedFailure',
            payload: 'I am an error message'
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/changeMedFailureTracking'
        });
    });
});

describe('disconnectMed', () => {
    it('dispatches correct actions on successful request', async () => {
        ChronicAPI.disconnectUserMedication.mockResolvedValue({disconnected: ['User 1', 'Medication 1']});
        const dispatch = vi.fn();
        await disconnectMed(1, 1, {medication: 'tylenol'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/disconnectFromMedRequest',
            payload: {medication: 'tylenol'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/disconnectFromMedRequestTracking',
            payload: {medication: 'tylenol'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/disconnectFromMedSuccess',
            payload: {disconnected: ['User 1', 'Medication 1']}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/disconnectFromMedSuccessTracking',
            payload: {disconnected: ['User 1', 'Medication 1']}
        });
    });
    it('dispatches correct actions on error', async () => {
        ChronicAPI.disconnectUserMedication.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await disconnectMed(1, 1, {medication: 'tylenol'})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/disconnectFromMedRequest',
            payload: {medication: 'tylenol'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/disconnectFromMedRequestTracking',
            payload: {medication: 'tylenol'}
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'profile/disconnectFromMedFailure',
            payload: 'I am an error message'
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/disconnectFromMedFailureTracking'
        });
    });
});