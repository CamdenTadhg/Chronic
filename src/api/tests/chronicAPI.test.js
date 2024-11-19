import ChronicAPI from '../chronicAPI';
import '@testing-library/jest-dom/vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {test, expect, beforeEach} from 'vitest';

let mock;
const baseUrl = 'http://localhost:3001';

beforeEach(() => {
    mock = new MockAdapter(axios);
    ChronicAPI.token = null;
});

test('signs in user and returns token', async () => {
    const signinData = {email: 'test@test.com', password: 'test'};
    mock.onPost(`${baseUrl}/auth/signin`, signinData).reply(200, {token: 'token', userId: 7});
    const results = await ChronicAPI.signin(signinData);
    expect(results).toEqual({token: 'token', userId: 7});
    expect(ChronicAPI.token).toEqual('token');
});

test('returns a signin error correctly', async () => {
    mock.onPost(`${baseUrl}/auth/signin`).reply(500, {error: {message: 'error message'}});
    await expect(ChronicAPI.signin()).rejects.toEqual('error message');
    expect(ChronicAPI.token).toEqual(null);
});

test('registers a user and returns token', async () => {
    const registrationData = {email: 'test@test.com', password: 'test', name: 'Test User'};
    mock.onPost(`${baseUrl}/auth/register`, registrationData).reply(200, {token: 'token', userId: 7});
    const results = await ChronicAPI.register(registrationData);
    expect(results).toEqual({token: 'token', userId: 7});
    expect(ChronicAPI.token).toEqual('token');
});

test('returns a registration error correctly', async () => {
    mock.onPost(`${baseUrl}/auth/register`).reply(500, {error: {message: 'error message'}});
    await expect(ChronicAPI.register()).rejects.toEqual('error message');
    expect(ChronicAPI.token).toEqual(null);
});

test('returns a user profile', async () => {
    const userProfile = {userId: 1, email: 'test@test.com', name: 'Test User', isAdmin: false, diagnoses: [{diagnosisId: 1, diagnosis: 'ME/CFS', keywords: 'long covid'}], symptoms: ['fatigue', 'brain fog'], medications: [{medication: 'LDN', dosageNum: 3, dosageUnit: 'mg', timeOfDay: ['Evening']}]};
    mock.onGet(`${baseUrl}/users/1`).reply(200, {user: userProfile});
    const results = await ChronicAPI.getUser(1);
    expect(results).toEqual(userProfile);
});

test('edits a user profile', async () => {
    const editData = {name: 'New Test User'}
    const editedData = {userId: 1, email: 'test@test.com', name: 'New Test User', isAdmin: false};
    mock.onPatch(`${baseUrl}/users/1`, editData).reply(200, {user: editedData});
    const results = await ChronicAPI.editUser(1, editData);
    expect(results).toEqual(editedData);
});

test('deletes a user profile', async () => {
    mock.onDelete(`${baseUrl}/users/1`).reply(200, {deleted: 1});
    const results = await ChronicAPI.deleteUser(1);
    expect(results).toEqual({deleted: 1});
});

test('returns a list of all diagnoses', async () => {
    mock.onGet(`${baseUrl}/diagnoses`).reply(200, {diagnoses: [
        {
            diagnosisId: 1,
            diagnosis: 'ME/CFS',
            synonyms: ['chronic fatigue syndrom', 'myalgic enchephalomyelitis']
        },
        {
            diagnosisId: 2,
            diagnosis: 'POTS',
            synonyms: ['postural orthostatic hypotension syndrome']
        }
    ]});
    const results = await ChronicAPI.getAllDiagnoses();
    expect(results).toEqual([
        {
            diagnosisId: 1,
            diagnosis: 'ME/CFS',
            synonyms: ['chronic fatigue syndrom', 'myalgic enchephalomyelitis']
        },
        {
            diagnosisId: 2,
            diagnosis: 'POTS',
            synonyms: ['postural orthostatic hypotension syndrome']
        }
    ]);
});

test('connects a user to a diagnosis and saves associated keywords', async () => {
    const userDiagnosisData = {keywords: ['fatigue', 'brain fog', 'long covid']};
    mock.onPost(`${baseUrl}/diagnoses/1/users/2`, userDiagnosisData).reply(200, {userDiagnosis: {userId: 2, diagnosisId: 1, keywords: ['fatigue', 'brain fog', 'long covid']}});
    const results = await ChronicAPI.connectUserDiagnosis(1, 2, userDiagnosisData);
    expect(results).toEqual({
        userId: 2,
        diagnosisId: 1, 
        keywords: ['fatigue', 'brain fog', 'long covid']
    });
});

test('updates a user-diagnosis connection with new keywords', async () => {
    const userDiagnosisData = {keywords: ['PEM']};
    mock.onPatch(`${baseUrl}/diagnoses/1/users/2`, userDiagnosisData).reply(200, {userDiagnosis: {userId: 2, diagnosisId: 1, keywords: ['fatigue', 'brain fog', 'long covid', 'PEM']}});
    const results = await ChronicAPI.updateUserDiagnosis(1, 2, userDiagnosisData);
    expect(results).toEqual({
        userId: 2, 
        diagnosisId: 1, 
        keywords: ['fatigue', 'brain fog', 'long covid', 'PEM']
    });
});

test('disconnects a user from a diagnosis', async () => {
    mock.onDelete(`${baseUrl}/diagnoses/1/users/2`).reply(200, {disconnected: ['User 2', 'Diagnosis 1']});
    const results = await ChronicAPI.disconnectUserDiagnosis(1, 2);
    expect(results).toEqual({disconnected: ['User 2', 'Diagnosis 1']});
});

test('returns a list of all symptoms', async() => {
    mock.onGet(`${baseUrl}/symptoms/`).reply(200, {symptoms: [
        {
            symptomId: 1,
            symptom: 'fatigue'
        },
        {
            symptomId: 2, 
            symptom: 'brain fog'
        }
    ]});
    const results = await ChronicAPI.getAllSymptoms();
    expect(results).toEqual([
        {
            symptomId: 1,
            symptom: 'fatigue'
        },
        {
            symptomId: 2, 
            symptom: 'brain fog'
        } 
    ]);
});

test('connects a user to a symptom', async() => {
    const userSymptomData = {symptom: 'malaise'};
    mock.onPost(`${baseUrl}/symptoms/0/users/2`, userSymptomData).reply(201, {userSymptom: {userId: 2, symptomId: 3}});
    const results = await ChronicAPI.connectUserSymptom(0, 2, userSymptomData);
    expect(results).toEqual({userId: 2, symptomId: 3});
});

test('changes the connection between a user and a symptom to a different symptom', async() => {
    const userSymptomData = {symptomId: 5};
    mock.onPatch(`${baseUrl}/symptoms/1/users/2`).reply(200, {userSymptom: {userId: 2, symptomId: 5}});
    const results = await ChronicAPI.changeUserSymptom(1, 2, userSymptomData);
    expect(results).toEqual({userId: 2, symptomId: 5})
});

test('disconnects a user from a symptom', async() => {
    mock.onDelete(`${baseUrl}/symptoms/5/users/2`).reply(200, {disconnected: ['User 2', 'Symptom 5']});
    const results = await ChronicAPI.disconnectUserSymptom(5, 2);
    expect(results).toEqual({disconnected: ['User 2', 'Symptom 5']});
});

test('creates a new symptom tracking record', async() => {
    const symptomTrackingData = {symptomId: 1, trackDate: '2024-10-29', timespan: '12-4 AM', severity: 5};
    mock.onPost(`${baseUrl}/symptoms/users/1/tracking`, symptomTrackingData).reply(200, {trackingRecord: {symtrackId: 1, userId: 1, symptomId: 1, trackDate: '2024-10-29', timespan: '12-4 AM', severity: 5}});
    const results = await ChronicAPI.createSymptomTrackingRecord(1, symptomTrackingData);
    expect(results).toEqual({symtrackId: 1, userId: 1, symptomId: 1, trackDate: '2024-10-29', timespan: '12-4 AM', severity: 5});
});

test('returns all symptom tracking records for a specific date', async() => {
    mock.onGet(`${baseUrl}/symptoms/users/1/trackingbydate/2024-10-29`).reply(200, {trackingRecords: {
        fatigue: {
            '12-4 AM': 3,
            '4-8 AM': 1,
            '8 AM-12 PM': 3
        },
        'brain fog': {
            '12-4 AM': 0,
            '4-8 AM': 1,
            '8 AM-12 PM': 3
        }
    }});
    const results = await ChronicAPI.getSymptomTrackingRecords(1, '2024-10-29');
    expect(results).toEqual({
        fatigue: {
            '12-4 AM': 3,
            '4-8 AM': 1,
            '8 AM-12 PM': 3
        },
        'brain fog': {
            '12-4 AM': 0,
            '4-8 AM': 1,
            '8 AM-12 PM': 3
        }
    });
});

test('changes the severity in a single symptom tracking record', async() => {
    const severityData = {severity: 1};
    mock.onPatch(`${baseUrl}/symptoms/users/1/tracking/15`, severityData).reply(200, {trackingRecord: {
        symtrackId: 15,
        userId: 1, 
        symptomId: 5,
        timespan: '12-4 AM',
        severity: 1
    }});
    const results = await ChronicAPI.updateSeverityLevel(1, 15, severityData);
    expect(results).toEqual({
        symtrackId: 15,
        userId: 1, 
        symptomId: 5,
        timespan: '12-4 AM',
        severity: 1 
    });
});

test('deletes a symptom tracking record', async() => {
    mock.onDelete(`${baseUrl}/symptoms/users/1/tracking/15`).reply(200, {deleted: 15});
    const results = await ChronicAPI.deleteSymptomTrackingRecord(1, 15);
    expect(results).toEqual({deleted: 15});
});

test('deletes an entire day of symptom tracking records', async() =>{
    mock.onDelete(`${baseUrl}/symptoms/users/1/trackingbydate/2024-10-19`).reply(200, {deleted: '2024-10-19'});
    const results = await ChronicAPI.deleteSymptomTrackingDate(1, '2024-10-19');
    expect(results).toEqual({deleted: '2024-10-19'})
});

test('returns a list of all medications', async() => {
    mock.onGet(`${baseUrl}/meds/`).reply(200, {medications: [
        {
            medId: 1,
            medication: 'buproprion'
        },
        {
            medId: 2, 
            medication: 'acyclovir'
        }
    ]});
    const results = await ChronicAPI.getAllMeds();
    expect(results).toEqual([
        {
            medId: 1,
            medication: 'buproprion'
        },
        {
            medId: 2, 
            medication: 'acyclovir'
        }
    ]);
});

test('connects a user to a medication', async() => {
    const userMedData = {dosageNum: 100, dosageUnit: 'mg', timeOfDay: ['AM', 'PM']};
    mock.onPost(`${baseUrl}/meds/1/users/2`, userMedData).reply(201, {userMedication: {userId: 2, medId: 1}});
    const results = await ChronicAPI.connectUserMedication(1, 2, userMedData);
    expect(results).toEqual({userId: 2, medId: 1});
});

test('changes the connection between a user and a med to a different med', async() => {
    const userMedData = {medId: 5};
    mock.onPatch(`${baseUrl}/meds/1/users/2`).reply(200, {userMedication: {userId: 2, medId: 5}});
    const results = await ChronicAPI.changeUserMedication(1, 2, userMedData);
    expect(results).toEqual({userId: 2, medId: 5})
});

test('disconnects a user from a med', async() => {
    mock.onDelete(`${baseUrl}/meds/5/users/2`).reply(200, {disconnected: ['User 2', 'Medication 5']});
    const results = await ChronicAPI.disconnectUserMedication(5, 2);
    expect(results).toEqual({disconnected: ['User 2', 'Medication 5']});
});

test('creates a new med tracking record', async() => {
    const medTrackingData = {medId: 1, trackDate: '2024-10-29', timeOfDay: 'AM', number: 1};
    mock.onPost(`${baseUrl}/meds/users/1/tracking`, medTrackingData).reply(200, {trackingRecord: {medtrackId: 1, userId: 1, medId: 1, trackDate: '2024-10-29', timeOfDay: 'AM', number: 1}});
    const results = await ChronicAPI.createMedTrackingRecord(1, medTrackingData);
    expect(results).toEqual({medtrackId: 1, userId: 1, medId: 1, trackDate: '2024-10-29', timeOfDay: 'AM', number: 1});
});

test('returns all med tracking records for a specific date', async() => {
    mock.onGet(`${baseUrl}/meds/users/1/trackingbydate/2024-10-29`).reply(200, {trackingRecords: {
        AM: {
            acyclovir: 1,
            propanalol: 2
        },
        Midday: {
            propanalol: 1
        },
        PM: {
            acyclovir: 1
        },
        Evening: {}
    }});
    const results = await ChronicAPI.getMedTrackingRecords(1, '2024-10-29');
    expect(results).toEqual({
        AM: {
            acyclovir: 1,
            propanalol: 2
        },
        Midday: {
            propanalol: 1
        },
        PM: {
            acyclovir: 1
        },
        Evening: {}
    });
});

test('changes the number in a single med tracking record', async() => {
    const numberData = {number: 2};
    mock.onPatch(`${baseUrl}/meds/users/1/tracking/15`, numberData).reply(200, {trackingRecord: {
        medtrackId: 15,
        userId: 1, 
        medId: 5,
        timeOfDay: 'AM',
        number: 2
    }});
    const results = await ChronicAPI.updateNumber(1, 15, numberData);
    expect(results).toEqual({
        medtrackId: 15,
        userId: 1, 
        medId: 5,
        timeOfDay: 'AM',
        number: 2
    });
});

test('deletes a med tracking record', async() => {
    mock.onDelete(`${baseUrl}/meds/users/1/tracking/15`).reply(200, {deleted: 15});
    const results = await ChronicAPI.deleteMedTrackingRecord(1, 15);
    expect(results).toEqual({deleted: 15});
});

test('deletes an entire day of med tracking records', async() =>{
    mock.onDelete(`${baseUrl}/meds/users/1/trackingbydate/2024-10-19`).reply(200, {deleted: '2024-10-19'});
    const results = await ChronicAPI.deleteMedTrackingDate(1, '2024-10-19');
    expect(results).toEqual({deleted: '2024-10-19'})
});

test('pulls symptom tracking data from the database for display', async() => {
    const symptomData = {
        userId: 1,
        startDate: '2024-10-01',
        endDate: '2024-10-31',
        symptoms: [1, 2, 3]
    };  
    mock.onGet(`${baseUrl}/data/symptoms`, {params: {userId: 1, startDate: '2024-10-01', endDate: '2024-10-31', symptoms: [1, 2, 3]}}).reply(200,{dataset: {
        nausea: [
            {datetime: '2024-09-21T05:00:00.000Z', severity: 3},
            {datetime: '2024-09-21T09:00:00.000Z', severity: 3},
            {datetime: '2024-09-21T13:00:00.000Z', severity: 2},
            {datetime: '2024-09-21T17:00:00.000Z', severity: 1},
            {datetime: '2024-09-21T21:00:00.000Z', severity: 5},
        ],
        fatigue: [
            {datetime: '2024-09-21T05:00:00.000Z', severity: 3},
            {datetime: '2024-09-21T09:00:00.000Z', severity: 2},
            {datetime: '2024-09-21T13:00:00.000Z', severity: 1},
            {datetime: '2024-09-21T17:00:00.000Z', severity: 4},
            {datetime: '2024-09-21T21:00:00.000Z', severity: 3},
            {datetime: '2024-09-22T01:00:00.000Z', severity: 2}
        ],
        'brain fog': [
            {datetime: '2024-09-21T05:00:00.000Z', severity: 1},
            {datetime: '2024-09-21T09:00:00.000Z', severity: 2},
            {datetime: '2024-09-21T13:00:00.000Z', severity: 3},
            {datetime: '2024-09-21T17:00:00.000Z', severity: 1},
            {datetime: '2024-09-21T21:00:00.000Z', severity: 3},
            {datetime: '2024-09-22T01:00:00.000Z', severity: 1}
        ]
    }});
    const results = await ChronicAPI.getSymptomData(symptomData);
    expect(results).toEqual(
        {
            nausea: [
                {datetime: '2024-09-21T05:00:00.000Z', severity: 3},
                {datetime: '2024-09-21T09:00:00.000Z', severity: 3},
                {datetime: '2024-09-21T13:00:00.000Z', severity: 2},
                {datetime: '2024-09-21T17:00:00.000Z', severity: 1},
                {datetime: '2024-09-21T21:00:00.000Z', severity: 5},
            ],
            fatigue: [
                {datetime: '2024-09-21T05:00:00.000Z', severity: 3},
                {datetime: '2024-09-21T09:00:00.000Z', severity: 2},
                {datetime: '2024-09-21T13:00:00.000Z', severity: 1},
                {datetime: '2024-09-21T17:00:00.000Z', severity: 4},
                {datetime: '2024-09-21T21:00:00.000Z', severity: 3},
                {datetime: '2024-09-22T01:00:00.000Z', severity: 2}
            ],
            'brain fog': [
                {datetime: '2024-09-21T05:00:00.000Z', severity: 1},
                {datetime: '2024-09-21T09:00:00.000Z', severity: 2},
                {datetime: '2024-09-21T13:00:00.000Z', severity: 3},
                {datetime: '2024-09-21T17:00:00.000Z', severity: 1},
                {datetime: '2024-09-21T21:00:00.000Z', severity: 3},
                {datetime: '2024-09-22T01:00:00.000Z', severity: 1}
            ]
        })
});

test('pulls med tracking data from the database for display', async() => {
    const medData = {
        userId: 1,
        startDate: '2024-10-01',
        endDate: '2024-10-31',
        meds: [1, 2, 3]
    };    
    mock.onGet(`${baseUrl}/data/meds`, {params: {
        userId: 1,
        startDate: '2024-10-01', 
        endDate: '2024-10-31', 
        meds: [1, 2, 3]
    }}).reply(200, {dataset: {
        tylenol: [
            {datetime: '2024-09-21T13:00:00.000Z', number: 2},
            {datetime: '2024-09-21T23:00:00.000Z', number: 1}
        ],
        advil: [
            {datetime: '2024-09-21T13:00:00.000Z', number: 1}
        ],
        propanalol: [
            {datetime: '2024-09-21T13:00:00.000Z', number: 1},
            {datetime: '2024-09-21T17:00:00.000Z', number: 1},
            {datetime: '2024-09-21T23:00:00.000Z', number: 2},
            {datetime: '2024-09-22T03:00:00.000Z', number: 1}
        ]
    }});
    const results = await ChronicAPI.getMedData(medData);
    expect(results).toEqual(
        {
            tylenol: [
                {datetime: '2024-09-21T13:00:00.000Z', number: 2},
                {datetime: '2024-09-21T23:00:00.000Z', number: 1}
            ],
            advil: [
                {datetime: '2024-09-21T13:00:00.000Z', number: 1}
            ],
            propanalol: [
                {datetime: '2024-09-21T13:00:00.000Z', number: 1},
                {datetime: '2024-09-21T17:00:00.000Z', number: 1},
                {datetime: '2024-09-21T23:00:00.000Z', number: 2},
                {datetime: '2024-09-22T03:00:00.000Z', number: 1}
            ]
        });
});

test('returns a set of articleIds based on a set of keywords', async () => {
    const keywords = ['chronic fatigue syndrome', 'brain fog', 'long covid'];
    mock.onGet(`${baseUrl}/latest/articleIds`, {params: {keywords}}).reply(200, {
        articleIds: ['12345678', '23456789', '34567890']
    });
    const results = await ChronicAPI.getArticleIds(keywords);
    expect(results).toEqual(['12345678', '23456789', '34567890']);
});

test('returns a set of article details based on a set of article ids', async () => {
    const articleIds = ['12345678', '23456789', '34567890'];
    mock.onGet(`${baseUrl}/latest/articles`, {params: {articleIds}}).reply(200, {
        articles: [
            {PMID: 345, title: "Chronic Fatigue Syndrome", abstract: 'This is an article about chronic fatigue syndrome'},
            {PMID: 467, title: 'Brain Fog', abstract: 'This is an article about brain fog'},
            {PMID: 785, title: 'Long Covid', abstract: 'This is an article about long covid'}
        ]
    });
})