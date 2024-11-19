import {pullData} from '../dataThunks';
import {describe, it, expect, vi} from 'vitest';

vi.mock('../../../api/chronicAPI', () => {
    return {
        default: {
            getSymptomData: vi.fn(),
            getMedData: vi.fn()
        }
    }
});

import ChronicAPI from '../../../api/chronicAPI';

describe('pullData', () => {
    it('dispatches correct actions on successful request', async () => {
        ChronicAPI.getSymptomData.mockResolvedValue({
            S1: [
                {datetime: '2024-09-21T05:00:00.000Z', severity: 3},
                {datetime: '2024-09-21T09:00:00.000Z', severity: 3},
                {datetime: '2024-09-21T13:00:00.000Z', severity: 2},
                {datetime: '2024-09-21T17:00:00.000Z', severity: 1},
                {datetime: '2024-09-21T21:00:00.000Z', severity: 5},
            ]
        });
        ChronicAPI.getMedData.mockResolvedValue({
            M1: [
                {datetime: '2024-09-21T13:00:00.000Z', number: 2},
                {datetime: '2024-09-21T23:00:00.000Z', number: 1}
            ]
        })
        const dispatch = vi.fn();
        await pullData({userId: 1, startDate: '2024-10-01', endDate: '2024-10-31', symptoms: [1, 2, 3]}, {userId: 1, startDate: '2024-10-01', endDate: '2024-10-31', medications: [1]})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'data/pullDataRequest'
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'data/pullDataSuccess',
            payload: {
                symptomDataRecords: {
                    S1: [
                        {datetime: '2024-09-21T05:00:00.000Z', severity: 3},
                        {datetime: '2024-09-21T09:00:00.000Z', severity: 3},
                        {datetime: '2024-09-21T13:00:00.000Z', severity: 2},
                        {datetime: '2024-09-21T17:00:00.000Z', severity: 1},
                        {datetime: '2024-09-21T21:00:00.000Z', severity: 5},
                    ]
                },
                medDataRecords: {
                    M1: [
                        {datetime: '2024-09-21T13:00:00.000Z', number: 2},
                        {datetime: '2024-09-21T23:00:00.000Z', number: 1}
                    ]
                }
            }
        })
    });
    it('dispatches correct actions on error', async () => {
        ChronicAPI.getSymptomData.mockRejectedValue(new Error('I am an error message'));
        ChronicAPI.getMedData.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await pullData({userId: 1, startDate: '2024-10-01', endDate: '2024-10-31', symptoms: [1, 2, 3]}, {userId: 1, startDate: '2024-10-01', endDate: '2024-10-31', medications: [1]})(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: 'data/pullDataRequest'
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'data/pullDataFailure',
            payload: 'I am an error message'
        });
    });
});