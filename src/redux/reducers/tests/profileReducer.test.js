import {profileSlice,
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
    disconnectFromMedFailure,
} from '../profileReducer';
import {describe, it, expect} from 'vitest';

describe('fetchProfile', () => {
    it('should handle fetchProfileRequest', () => {
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
        };
        const action = fetchProfileRequest();
        const expectedState = {
            ...initialState,
            loading: true,
            error: null,
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle fetchProfileSuccess', () => {
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
            loading: true,
            error: null,
            history: {}
        };
        const action = fetchProfileSuccess(
            {
                userId: 1,
                email: 'u1@test.com', 
                name: 'U1', 
                isAdmin: false,
                since: '2020-07-15T12:34:56.789Z',
                lastLogin: '2020-07-15T12:34:56.789Z',
                diagnoses: [
                    {
                        diagnosisId: 1,
                        diagnosis: 'D1', 
                        keywords: ["pain"]
                    }
                ],
                symptoms: ['S1'],
                medications: [
                    {
                        medication: 'M1', 
                        dosageNum:300,
                        dosageUnit: 'mg',
                        timeOfDay: ['AM', 'PM']
                    }
                ]
            }
        );
        const expectedState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosisId: 1,
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {}
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle fetchProfileFailure', () => {
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
            loading: true,
            error: null,
            history: {}
        };
        const action = fetchProfileFailure('No such user exists');
        const expectedState = {
            ...initialState,
            loading: false,
            error: 'No such user exists'
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('updateProfile', () => {
    it('should handle updateProfileRequest', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosisId: 1,
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {}
        };
        const action = updateProfileRequest({
            email: 'camden@test.com',
            password: 'password'
        });
        const expectedState = {
            ...initialState,
            email: 'camden@test.com',
            loading: true,
            error: null,
            history: {
                email: 'u1@test.com',
                name: 'U1',
            }
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle updateProfileSuccess', () => {
        const initialState = {
            userId: 1,
            email: 'camden@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosisId: 1,
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: true,
            error: null,
            history: {
                email: 'u1@test.com',
                name: 'U1',
            }
        };
        const action = updateProfileSuccess();
        const expectedState = {
            userId: 1,
            email: 'camden@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosisId: 1,
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {}
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle updateProfileFailure', () => {
        const initialState = {
            userId: 1,
            email: 'camden@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosisId: 1,
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: true,
            error: null,
            history: {
                email: 'u1@test.com',
                name: 'U1',
            }
        };
        const action = updateProfileFailure('No such user exists');
        const expectedState = {
            ...initialState,
            email: 'u1@test.com',
            loading: false,
            error: 'No such user exists',
            history: {}
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('deleteProfile', () => {
    it('should handle deleteProfileRequest', () => {
        const initialState = {
            userId: 1,
            email: 'camden@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosisId: 1,
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {}
        };
        const action = deleteProfileRequest();
        const expectedState = {
            ...initialState,
            loading: true,
            error: null,
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle deleteProfileSuccess', () => {
        const initialState = {
            userId: 1,
            email: 'camden@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosisId: 1,
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: true,
            error: null,
            history: {
                email: 'u1@test.com',
                name: 'U1',
            }
        };
        const action = deleteProfileSuccess();
        const expectedState = {
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
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle deleteProfileFailure', () => {
        const initialState = {
            userId: 1,
            email: 'camden@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosisId: 1,
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: true,
            error: null,
            history: {}
        };
        const action = deleteProfileFailure('No such user exists');
        const expectedState = {
            ...initialState,
            loading: false,
            error: 'No such user exists',
            history: {}
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('connectDiagnosis', () => {
    it('should handle connectDiagnosisRequest', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosisId: 1,
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {}
        };
        const action = connectDiagnosisRequest({
            diagnosis: 'ME/CFS',
            keywords: ['chronic fatigue syndrome', 'myalgic myencephalitis']
        });
        const expectedState = {
            ...initialState,
            loading: true,
            error: null,
            diagnoses: [
                {
                    diagnosisId: 1,
                    diagnosis: 'D1',
                    keywords: ['pain']
                },
                {
                    diagnosis: 'ME/CFS', 
                    keywords: ['chronic fatigue syndrome', 'myalgic myencephalitis']
                }
            ]

        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle connectDiagnosisSuccess', () => {
        const initialState = {
            userId: 1,
            email: 'camden@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [
                {
                    diagnosisId: 1,
                    diagnosis: 'D1', 
                    keywords: ["pain"]
                },
                {
                    diagnosis: 'ME/CFS',
                    keywords: ['chronic fatigue syndrome', 'myalgic myencephalitis']
                }
            ],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: true,
            error: null,
            history: {}
        };
        const APIResponse = {diagnosisId: 2, diagnosis: 'ME/CFS', keywords: ['chronic fatigue syndrome', 'myalgic encephalomyelitis']}
        const action = connectDiagnosisSuccess(APIResponse);
        const expectedState = {
            ...initialState,
            diagnoses: [
                {
                    diagnosisId: 1,
                    diagnosis: 'D1', 
                    keywords: ['pain']
                }, 
                {
                    diagnosisId: 2,
                    diagnosis: 'ME/CFS',
                    keywords: ['chronic fatigue syndrome', 'myalgic myencephalitis']
                }
            ],
            loading: false
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle connectDiagnosisFailure', () => {
        const initialState = {
            userId: 1,
            email: 'camden@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [
                {
                    diagnosisId: 1,
                    diagnosis: 'D1', 
                    keywords: ["pain"]
                },
                {
                    diagnosis: 'ME/CFS',
                    keywords: ['chronic fatigue syndrome', 'myalgic myencephalitis']
                }
            ],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: true,
            error: null,
            history: {}
        };
        const action = connectDiagnosisFailure('No such diagnosis exists');
        const expectedState = {
            ...initialState,
            diagnoses: [
                {
                    diagnosisId: 1,
                    diagnosis: 'D1', 
                    keywords: ["pain"]
                }
            ],
            loading: false,
            error: 'No such diagnosis exists'

        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('updateUserDiagnosis', () => {
    it('should handle updateUserDiagnosisRequest', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {}
        };
        const action = updateUserDiagnosisRequest({
            diagnosis: 'D1',
            keywords: ['D1 syndrome']
        });
        const expectedState = {
            ...initialState,
            loading: true,
            error: null,
            diagnoses: [
                {
                    diagnosis: 'D1',
                    keywords: ['pain', 'D1 syndrome']
                }
            ],
            history: {
                diagnoses: [{
                    diagnosis: 'D1', 
                    keywords: ["pain"]
                }]
            }

        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle updateUserDiagnosisSuccess', () => {
        const initialState = {
            userId: 1,
            email: 'camden@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [
                {
                    diagnosis: 'D1', 
                    keywords: ["pain", 'D1 syndrome']
                }
            ],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: true,
            error: null,
            history: {
                diagnoses: [{
                    diagnosis: 'D1', 
                    keywords: ["pain"]
                }]
            }
        };
        const action = updateUserDiagnosisSuccess();
        const expectedState = {
            ...initialState,
            loading: false,
            history: {}
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle updateUserDiagnosisFailure', () => {
        const initialState = {
            userId: 1,
            email: 'camden@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [
                {
                    diagnosis: 'D1', 
                    keywords: ["pain", 'D1 syndrome']
                }
            ],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: true,
            error: null,
            history: {
                diagnoses: [{
                    diagnosis: 'D1', 
                    keywords: ["pain"]
                }]
            }
        };
        const action = updateUserDiagnosisFailure('No such user diagnosis exists');
        const expectedState = {
            ...initialState,
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            loading: false,
            error: 'No such user diagnosis exists',
            history: {}
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('disconnectFromDiagnosis', () => {
    it('should handle disconnectFromDiagnosisRequest', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {}
        };
        const action = disconnectFromDiagnosisRequest({
            diagnosis: 'D1'
        });
        const expectedState = {
            ...initialState,
            loading: true,
            error: null,
            diagnoses: [],
            history: {
                diagnoses: [{
                    diagnosis: 'D1', 
                    keywords: ["pain"]
                }],
            }
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle disconnectFromDiagnosisSuccess', () => {
        const initialState = {
            userId: 1,
            email: 'camden@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: true,
            error: null,
            history: {
                diagnoses: [{
                    diagnosis: 'D1', 
                    keywords: ["pain"]
                }]
            }
        };
        const action = disconnectFromDiagnosisSuccess();
        const expectedState = {
            ...initialState,
            loading: false,
            history: {}
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle disconnectFromDiagnosisFailure', () => {
        const initialState = {
            userId: 1,
            email: 'camden@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: true,
            error: null,
            history: {
                diagnoses: [{
                    diagnosis: 'D1', 
                    keywords: ["pain"]
                }]
            }
        };
        const action = disconnectFromDiagnosisFailure('No such user diagnosis exists');
        const expectedState = {
            ...initialState,
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            loading: false,
            error: 'No such user diagnosis exists',
            history: {}
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('connectSymptom', () => {
    it('should handle connectSymptomRequest', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {}
        };
        const action = connectSymptomRequest({
            symptom: 'fatigue'
        });
        const expectedState = {
            ...initialState,
            loading: true,
            error: null,
            symptoms: ['S1', 'fatigue']
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle connectSymptomSuccess', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1', 'fatigue'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {}
        };
        const action = connectSymptomSuccess();
        const expectedState = {
            ...initialState,
            loading: false
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle connectSymptomFailure', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1', 'fatigue'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {}
        };
        const action = connectSymptomFailure('No such symptom exists');
        const expectedState = {
            ...initialState,
            loading: false,
            error: 'No such symptom exists',
            symptoms: ['S1']
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('changeSymptom', () => {
    it('should handle changeSymptomRequest', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {}
        };
        const action = changeSymptomRequest({
            oldSymptom: 'S1', 
            newSymptom: 'pain'
        });
        const expectedState = {
            ...initialState,
            loading: true,
            error: null, 
            history: {symptoms: ['S1']},
            symptoms: ['pain']
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle changeSymptomSuccess', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['pain'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {symptoms: ['S1']},

        };
        const action = changeSymptomSuccess();
        const expectedState = {
            ...initialState,
            loading: false,
            history: {}
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle changeSymptomFailure', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['pain'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {symptoms: ['S1']},
        };
        const action = changeSymptomFailure('No such symptom exists');
        const expectedState = {
            ...initialState,
            loading: false,
            error: 'No such symptom exists',
            symptoms: ['S1'],
            history: {}
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('disconnectFromSymptom', () => {
    it('should handle disconnectFromSymptomRequest', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {}
        };
        const action = disconnectFromSymptomRequest({
            symptom: 'S1'
        });
        const expectedState = {
            ...initialState,
            loading: true,
            error: null, 
            history: {symptoms: ['S1']},
            symptoms: []
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle disconnectFromSymptomSuccess', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: [],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {symptoms: ['S1']},

        };
        const action = disconnectFromSymptomSuccess();
        const expectedState = {
            ...initialState,
            loading: false,
            history: {}
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle disconnectFromSymptomFailure', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: [],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {symptoms: ['S1']},
        };
        const action = disconnectFromSymptomFailure('No such symptom exists');
        const expectedState = {
            ...initialState,
            loading: false,
            error: 'No such symptom exists',
            symptoms: ['S1'],
            history: {}
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('connectMed', () => {
    it('should handle connectMedRequest', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {}
        };
        const action = connectMedRequest({
            medication: 'tylenol',
            dosageNum: 100,
            dosageUnit: 'mg', 
            timeOfDay: ['AM', 'Midday', 'PM', 'Evening']
        });
        const expectedState = {
            ...initialState,
            loading: true,
            error: null, 
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            },
            {
                medication: 'tylenol',
                dosageNum: 100,
                dosageUnit: 'mg', 
                timeOfDay: ['AM', 'Midday', 'PM', 'Evening']
            }],
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle connectMedSuccess', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: [],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            },
            {
                medication: 'tylenol',
                dosageNum: 100,
                dosageUnit: 'mg', 
                timeOfDay: ['AM', 'Midday', 'PM', 'Evening']
            }],
            loading: false,
            error: null,
            history: {},
        };
        const action = connectMedSuccess();
        const expectedState = {
            ...initialState,
            loading: false
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle connectMedFailure', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: [],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            },
            {
                medication: 'tylenol',
                dosageNum: 100,
                dosageUnit: 'mg', 
                timeOfDay: ['AM', 'Midday', 'PM', 'Evening']
            }],
            loading: false,
            error: null,
            history: {},
        };
        const action = connectMedFailure('No such user exists');
        const expectedState = {
            ...initialState,
            loading: false,
            error: 'No such user exists',
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('changeMed', () => {
    it('should handle changeMedRequest', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {}
        };
        const action = changeMedRequest({
            oldMed: 'M1',
            newMed: {
                medication: 'tylenol', 
                dosageNum: 100,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }
        });
        const expectedState = {
            ...initialState,
            loading: true,
            error: null, 
            medications: [{
                medication: 'tylenol', 
                dosageNum: 100,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            history: {
                medications: [{
                    medication: 'M1', 
                    dosageNum:300,
                    dosageUnit: 'mg',
                    timeOfDay: ['AM', 'PM']
                }],
            }
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle changeMedSuccess', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: [],
            medications: [{
                medication: 'tylenol', 
                dosageNum: 100,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {
                medications: [{
                    medication: 'M1', 
                    dosageNum:300,
                    dosageUnit: 'mg',
                    timeOfDay: ['AM', 'PM']
                }]},
        };
        const action = changeMedSuccess();
        const expectedState = {
            ...initialState,
            loading: false,
            history: {}
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle changeMedFailure', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: [],
            medications: [{
                medication: 'tylenol', 
                dosageNum: 100,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {
                medications: [{
                    medication: 'M1', 
                    dosageNum:300,
                    dosageUnit: 'mg',
                    timeOfDay: ['AM', 'PM']
                }]},
        };
        const action = changeMedFailure('No such medication exists');
        const expectedState = {
            ...initialState,
            loading: false,
            error: 'No such medication exists',
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            history: {}
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('disconnectFromMed', () => {
    it('should handle disconnectFromMedRequest', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: ['S1'],
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            loading: false,
            error: null,
            history: {}
        };
        const action = disconnectFromMedRequest({
            medication: 'M1'
        });
        const expectedState = {
            ...initialState,
            loading: true,
            error: null, 
            medications: [],
            history: {
                medications: [{
                    medication: 'M1', 
                    dosageNum:300,
                    dosageUnit: 'mg',
                    timeOfDay: ['AM', 'PM']
                }],
            }
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle disconnectFromMedSuccess', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: [],
            medications: [],
            loading: false,
            error: null,
            history: {
                medications: [{
                    medication: 'M1', 
                    dosageNum:300,
                    dosageUnit: 'mg',
                    timeOfDay: ['AM', 'PM']
                }]},
        };
        const action = disconnectFromMedSuccess();
        const expectedState = {
            ...initialState,
            loading: false,
            history: {}
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle disconnectFromMedFailure', () => {
        const initialState = {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
            since: '2020-07-15T12:34:56.789Z',
            lastLogin: '2020-07-15T12:34:56.789Z',
            diagnoses: [{
                diagnosis: 'D1', 
                keywords: ["pain"]
            }],
            symptoms: [],
            medications: [],
            loading: false,
            error: null,
            history: {
                medications: [{
                    medication: 'M1', 
                    dosageNum:300,
                    dosageUnit: 'mg',
                    timeOfDay: ['AM', 'PM']
                }]},
        };
        const action = disconnectFromMedFailure('No such medication exists');
        const expectedState = {
            ...initialState,
            loading: false,
            error: 'No such medication exists',
            medications: [{
                medication: 'M1', 
                dosageNum:300,
                dosageUnit: 'mg',
                timeOfDay: ['AM', 'PM']
            }],
            history: {}
        };
        expect(profileSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});
