import {
    fetchDaysTracking,
    createSymptomTrackingRecord,
    editSymptomTrackingRecord,
    deleteSymptomTrackingRecord,
    createMedTrackingRecord,
    editMedTrackingRecord,
    deleteMedTrackingRecord
} from '../trackingThunks';
import {describe, it, expect, vi} from 'vitest';

vi.mock('../../../api/chronicAPI', () => {
    return {
        default: {
            getSymptomTrackingRecords: vi.fn(),
            getMedTrackingRecords: vi.fn(),
            createSymptomTrackingRecord: vi.fn(),
            updateSeverityLevel: vi.fn(),
            deleteSymptomTrackingRecord: vi.fn(),
            createMedTrackingRecord: vi.fn(),
            updateNumber: vi.fn(),
            deleteMedTrackingRecord: vi.fn()
        }
    }
})

import ChronicAPI from '../../../api/chronicAPI';

describe('fetchDaysTracking', () => {
    it('dispatches the correct actions on successful request', async () => {
        ChronicAPI.getSymptomTrackingRecords.mockResolvedValue({'S1': {'8am-12pm': 2}});
        ChronicAPI.getMedTrackingRecords.mockResolvedValue({AM: {'M1': 1}, Midday: {}, PM: {'M1': 2}, Evening: {}})
        const dispatch = vi.fn();
        await fetchDaysTracking(1, '2024-10-31', 'primaryTracking')(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/fetchDaysTrackingRequest'
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/fetchDaysTrackingSuccess',
            payload: {
                slice: 'primaryTracking',
                symptomTrackingData: {'S1': {'8am-12pm': 2}},
                medTrackingData: {AM: {'M1': 1}, Midday: {}, PM: {'M1': 2}, Evening: {}}
            }
        });
    });
    it('dispatches the correct actions on error', async () => {
        ChronicAPI.getSymptomTrackingRecords.mockRejectedValue(new Error('I am an error message'));
        ChronicAPI.getMedTrackingRecords.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await fetchDaysTracking(1, '2024-10-31', 'primaryTracking')(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/fetchDaysTrackingRequest'
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/fetchDaysTrackingFailure',
            payload: 'I am an error message'
        });
    });
});

describe('createSymptomTrackingRecord', () => {
    it('dispatches the correct actions on successful request', async () => {
        ChronicAPI.createSymptomTrackingRecord.mockResolvedValue({userId: 1, symptomId: 1, timespan: '12-4 PM', severity: 3});
        const dispatch = vi.fn();
        await createSymptomTrackingRecord(1, {
            symptomId: 1,
            date: '2024-10-31',
            timespan: '12-4 PM', 
            severity: 3
        },
        {
            symptom: 'fatigue', 
            date: '2024-10-31',
            timespan: '12-4 PM', 
            severity: 3
        }
        )(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/createSymptomTrackingRecordRequest',
            payload:         {
                symptom: 'fatigue', 
                date: '2024-10-31',
                timespan: '12-4 PM', 
                severity: 3
            }
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/createSymptomTrackingRecordSuccess',
            payload: {userId: 1, symptomId: 1, timespan: '12-4 PM', severity: 3}
        });
    });
    it('dispatches the correct actions on error', async () => {
        ChronicAPI.createSymptomTrackingRecord.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await createSymptomTrackingRecord(1, {
            symptomId: 1,
            date: '2024-10-31',
            timespan: '12-4 PM', 
            severity: 3
        },
        {
            symptom: 'fatigue', 
            date: '2024-10-31',
            timespan: '12-4 PM', 
            severity: 3
        }
        )(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/createSymptomTrackingRecordRequest',
            payload:         {
                symptom: 'fatigue', 
                date: '2024-10-31',
                timespan: '12-4 PM', 
                severity: 3
            }
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/createSymptomTrackingRecordFailure',
            payload: {
                dataForStore:         {
                    symptom: 'fatigue', 
                    date: '2024-10-31',
                    timespan: '12-4 PM', 
                    severity: 3
                },
                error: 'I am an error message'
            }
        });
    });
});

describe('editSymptomTrackingRecord', () => {
    it('dispatches the correct actions on successful request', async () => {
        ChronicAPI.updateSeverityLevel.mockResolvedValue({userId: 1, symptomId: 1, timespan: '12-4 PM', severity: 3});
        const dispatch = vi.fn();
        await editSymptomTrackingRecord(1, 1, {
            symptomId: 1,
            date: '2024-10-31',
            timespan: '12-4 PM', 
            severity: 3
        },
        {
            symptom: 'fatigue', 
            date: '2024-10-31',
            timespan: '12-4 PM', 
            severity: 3
        }
        )(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/editSymptomTrackingRecordRequest',
            payload:         {
                symptom: 'fatigue', 
                date: '2024-10-31',
                timespan: '12-4 PM', 
                severity: 3
            }
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/editSymptomTrackingRecordSuccess',
            payload: {userId: 1, symptomId: 1, timespan: '12-4 PM', severity: 3}
        });
    });
    it('dispatches the correct actions on error', async () => {
        ChronicAPI.updateSeverityLevel.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await editSymptomTrackingRecord(1, 1, {
            symptomId: 1,
            date: '2024-10-31',
            timespan: '12-4 PM', 
            severity: 3
        },
        {
            symptom: 'fatigue', 
            date: '2024-10-31',
            timespan: '12-4 PM', 
            severity: 3
        }
        )(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/editSymptomTrackingRecordRequest',
            payload:         {
                symptom: 'fatigue', 
                date: '2024-10-31',
                timespan: '12-4 PM', 
                severity: 3
            }
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/editSymptomTrackingRecordFailure',
            payload: {
                dataForStore:         {
                    symptom: 'fatigue', 
                    date: '2024-10-31',
                    timespan: '12-4 PM', 
                    severity: 3
                },
                error: 'I am an error message'
            }
        });
    });
});

describe('deleteSymptomTrackingRecord', () => {
    it('dispatches the correct actions on successful request', async () => {
        ChronicAPI.deleteSymptomTrackingRecord.mockResolvedValue({deleted: 1});
        const dispatch = vi.fn();
        await deleteSymptomTrackingRecord(1, 1,
        {
            symptom: 'fatigue', 
            date: '2024-10-31',
            timespan: '12-4 PM', 
            severity: 3
        }
        )(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/deleteSymptomTrackingRecordRequest',
            payload:         {
                symptom: 'fatigue', 
                date: '2024-10-31',
                timespan: '12-4 PM', 
                severity: 3
            }
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/deleteSymptomTrackingRecordSuccess',
            payload: {deleted: 1}
        });
    });
    it('dispatches the correct actions on error', async () => {
        ChronicAPI.deleteSymptomTrackingRecord.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await deleteSymptomTrackingRecord(1, 1,
            {
                symptom: 'fatigue', 
                date: '2024-10-31',
                timespan: '12-4 PM', 
                severity: 3
            }
            )(dispatch);
    
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/deleteSymptomTrackingRecordRequest',
            payload:         {
                symptom: 'fatigue', 
                date: '2024-10-31',
                timespan: '12-4 PM', 
                severity: 3
            }
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/deleteSymptomTrackingRecordFailure',
            payload: {
                dataForStore:         {
                    symptom: 'fatigue', 
                    date: '2024-10-31',
                    timespan: '12-4 PM', 
                    severity: 3
                },
                error: 'I am an error message'
            }
        });
    });
});

describe('createMedTrackingRecord', () => {
    it('dispatches the correct actions on successful request', async () => {
        ChronicAPI.createMedTrackingRecord.mockResolvedValue({userId: 1, medId: 1, date: '2024-10-31', timeOfDay: 'AM', number: 1});
        const dispatch = vi.fn();
        await createMedTrackingRecord(1, {
            userId: 1, 
            medId: 1, 
            date: '2024-10-31', 
            timeOfDay: 'AM', 
            number: 1
        },
        {
            medication: 'tylenol', 
            date: '2024-10-31',
            timeOfDay: 'AM', 
            number: 3
        }
        )(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/createMedTrackingRecordRequest',
            payload:                 {
                medication: 'tylenol', 
                date: '2024-10-31',
                timeOfDay: 'AM', 
                number: 3
            }
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/createMedTrackingRecordSuccess',
            payload: {userId: 1, medId: 1, date: '2024-10-31', timeOfDay: 'AM', number: 1}
        });
    });
    it('dispatches the correct actions on error', async () => {
        ChronicAPI.createMedTrackingRecord.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await createMedTrackingRecord(1, {
            userId: 1, 
            medId: 1, 
            date: '2024-10-31', 
            timeOfDay: 'AM', 
            number: 1
        },
        {
            medication: 'tylenol', 
            date: '2024-10-31',
            timeOfDay: 'AM', 
            number: 3
        }
        )(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/createMedTrackingRecordRequest',
            payload:                 {
                medication: 'tylenol', 
                date: '2024-10-31',
                timeOfDay: 'AM', 
                number: 3
            }
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/createMedTrackingRecordFailure',
            payload: {
                dataForStore:                 {
                    medication: 'tylenol', 
                    date: '2024-10-31',
                    timeOfDay: 'AM', 
                    number: 3
                },
                error: 'I am an error message'
            }
        });
    });
});

describe('editMedTrackingRecord', () => {
    it('dispatches the correct actions on successful request', async () => {
        ChronicAPI.updateNumber.mockResolvedValue({userId: 1, medId: 1, date: '2024-10-31', timeOfDay: 'AM', number: 1});
        const dispatch = vi.fn();
        await editMedTrackingRecord(1, 1, {
            userId: 1, 
            medId: 1, 
            date: '2024-10-31', 
            timeOfDay: 'AM', 
            number: 1
        },
        {
            medication: 'tylenol', 
            date: '2024-10-31',
            timeOfDay: 'AM', 
            number: 3
        }
        )(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/editMedTrackingRecordRequest',
            payload:                 {
                medication: 'tylenol', 
                date: '2024-10-31',
                timeOfDay: 'AM', 
                number: 3
            }
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/editMedTrackingRecordSuccess',
            payload: {userId: 1, medId: 1, date: '2024-10-31', timeOfDay: 'AM', number: 1}
        });
    });
    it('dispatches the correct actions on error', async () => {
        ChronicAPI.updateNumber.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await editMedTrackingRecord(1, 1, {
            userId: 1, 
            medId: 1, 
            date: '2024-10-31', 
            timeOfDay: 'AM', 
            number: 1
        },
        {
            medication: 'tylenol', 
            date: '2024-10-31',
            timeOfDay: 'AM', 
            number: 3
        }
        )(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/editMedTrackingRecordRequest',
            payload:                 {
                medication: 'tylenol', 
                date: '2024-10-31',
                timeOfDay: 'AM', 
                number: 3
            }
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/editMedTrackingRecordFailure',
            payload: {
                dataForStore:                 {
                    medication: 'tylenol', 
                    date: '2024-10-31',
                    timeOfDay: 'AM', 
                    number: 3
                },
                error: 'I am an error message'
            }
        });
    });
});

describe('deleteMedTrackingRecord', () => {
    it('dispatches the correct actions on successful request', async () => {
        ChronicAPI.deleteMedTrackingRecord.mockResolvedValue({deleted: 1});
        const dispatch = vi.fn();
        await deleteMedTrackingRecord(1, 1,
        {
            medication: 'tylenol', 
            date: '2024-10-31',
            timeOfDay: 'AM', 
            number: 3
        }
        )(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/deleteMedTrackingRecordRequest',
            payload:                 {
                medication: 'tylenol', 
                date: '2024-10-31',
                timeOfDay: 'AM', 
                number: 3
            }
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/deleteMedTrackingRecordSuccess',
            payload: {deleted: 1}
        });
    });
    it('dispatches the correct actions on error', async () => {
        ChronicAPI.deleteMedTrackingRecord.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await deleteMedTrackingRecord(1, 1,
            {
                medication: 'tylenol', 
                date: '2024-10-31',
                timeOfDay: 'AM', 
                number: 3
            }
            )(dispatch);
    
            expect(dispatch).toHaveBeenCalledWith({
                type: 'tracking/deleteMedTrackingRecordRequest',
                payload:                 {
                    medication: 'tylenol', 
                    date: '2024-10-31',
                    timeOfDay: 'AM', 
                    number: 3
                }
            });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'tracking/deleteMedTrackingRecordFailure',
            payload: {
                dataForStore:                 {
                    medication: 'tylenol', 
                    date: '2024-10-31',
                    timeOfDay: 'AM', 
                    number: 3
                },
                error: 'I am an error message'
            }
        });
    });
});