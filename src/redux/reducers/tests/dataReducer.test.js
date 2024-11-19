import {dataSlice,
    pullDataRequest,
    pullDataSuccess,
    pullDataFailure
} from '../dataReducer';
import {describe, it, expect} from 'vitest';

describe('pullData', () => {
    it('should handle pullDataRequest', () => {
        const initialState = {
            symptoms: {},
            medications: {},
            loading: false,
            error: null
        }
        const action = pullDataRequest();
        const expectedState = {
            symptoms: {},
            medications: {},
            loading: true,
            error: null
        };
        expect(dataSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle pullDataSuccess', () => {
        const initialState = {
            symptoms: {},
            medications: {},
            loading: true,
            error: null
        };
        const action = pullDataSuccess({
            symptomDataRecords: {
                S1: [
                    {datetime: '2024-09-21T05:00:00.000Z', severity: 3},
                    {datetime: '2024-09-21T09:00:00.000Z', severity: 3},
                    {datetime: '2024-09-21T13:00:00.000Z', severity: 2},
                    {datetime: '2024-09-21T17:00:00.000Z', severity: 1},
                    {datetime: '2024-09-21T21:00:00.000Z', severity: 5},
                ],
                S2: [
                    {datetime: '2024-09-21T05:00:00.000Z', severity: 3},
                    {datetime: '2024-09-21T09:00:00.000Z', severity: 2},
                    {datetime: '2024-09-21T13:00:00.000Z', severity: 1},
                    {datetime: '2024-09-21T17:00:00.000Z', severity: 4},
                    {datetime: '2024-09-21T21:00:00.000Z', severity: 3},
                    {datetime: '2024-09-22T01:00:00.000Z', severity: 2}
                ],
                S3: [
                    {datetime: '2024-09-21T05:00:00.000Z', severity: 1},
                    {datetime: '2024-09-21T09:00:00.000Z', severity: 2},
                    {datetime: '2024-09-21T13:00:00.000Z', severity: 3},
                    {datetime: '2024-09-21T17:00:00.000Z', severity: 1},
                    {datetime: '2024-09-21T21:00:00.000Z', severity: 3},
                    {datetime: '2024-09-22T01:00:00.000Z', severity: 1}
                ]
            },
            medDataRecords: {
                M1: [
                    {datetime: '2024-09-21T13:00:00.000Z', number: 2},
                    {datetime: '2024-09-21T23:00:00.000Z', number: 1}
                ],
                M2: [
                    {datetime: '2024-09-21T13:00:00.000Z', number: 1}
                ],
                M3: [
                    {datetime: '2024-09-21T13:00:00.000Z', number: 1},
                    {datetime: '2024-09-21T17:00:00.000Z', number: 1},
                    {datetime: '2024-09-21T23:00:00.000Z', number: 2},
                    {datetime: '2024-09-22T03:00:00.000Z', number: 1}
                ]
            }
        });
        const expectedState = {
            symptoms: {
                S1: [
                    {datetime: '2024-09-21T05:00:00.000Z', severity: 3},
                    {datetime: '2024-09-21T09:00:00.000Z', severity: 3},
                    {datetime: '2024-09-21T13:00:00.000Z', severity: 2},
                    {datetime: '2024-09-21T17:00:00.000Z', severity: 1},
                    {datetime: '2024-09-21T21:00:00.000Z', severity: 5},
                ],
                S2: [
                    {datetime: '2024-09-21T05:00:00.000Z', severity: 3},
                    {datetime: '2024-09-21T09:00:00.000Z', severity: 2},
                    {datetime: '2024-09-21T13:00:00.000Z', severity: 1},
                    {datetime: '2024-09-21T17:00:00.000Z', severity: 4},
                    {datetime: '2024-09-21T21:00:00.000Z', severity: 3},
                    {datetime: '2024-09-22T01:00:00.000Z', severity: 2}
                ],
                S3: [
                    {datetime: '2024-09-21T05:00:00.000Z', severity: 1},
                    {datetime: '2024-09-21T09:00:00.000Z', severity: 2},
                    {datetime: '2024-09-21T13:00:00.000Z', severity: 3},
                    {datetime: '2024-09-21T17:00:00.000Z', severity: 1},
                    {datetime: '2024-09-21T21:00:00.000Z', severity: 3},
                    {datetime: '2024-09-22T01:00:00.000Z', severity: 1}
                ]
            },
            medications: {
                M1: [
                    {datetime: '2024-09-21T13:00:00.000Z', number: 2},
                    {datetime: '2024-09-21T23:00:00.000Z', number: 1}
                ],
                M2: [
                    {datetime: '2024-09-21T13:00:00.000Z', number: 1}
                ],
                M3: [
                    {datetime: '2024-09-21T13:00:00.000Z', number: 1},
                    {datetime: '2024-09-21T17:00:00.000Z', number: 1},
                    {datetime: '2024-09-21T23:00:00.000Z', number: 2},
                    {datetime: '2024-09-22T03:00:00.000Z', number: 1}
                ]
            },
            loading: false,
            error: null
        }
        expect(dataSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle pullDataFailure', () => {
        const initialState = {
            symptoms: {},
            medications: {},
            loading: true,
            error: null
        };
        const action = pullDataFailure('no such data exists');
        const expectedState = {
            symptoms: {},
            medications: {},
            loading: false,
            error: 'no such data exists'
        };
        expect(dataSlice.reducer(initialState, action)).toEqual(expectedState);
    });
})