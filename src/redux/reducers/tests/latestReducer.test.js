import {latestSlice, 
    fetchLatestRequest,
    fetchLatestSuccess,
    fetchLatestFailure,
} from '../latestReducer';
import {describe, it, expect} from 'vitest';

describe('fetchLatest', () => {
    it('should handle fetchLatestRequest', () => {
        const initialState = {
            articleIds: [],
            loading: false,
            error: null
        };
        const action = fetchLatestRequest();
        const expectedState = {
            ...initialState,
            loading: true,
            error: null
        };
        expect(latestSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle fetchLatestSuccess', () => {
        const initialState = {
            articleIds: [],
            loading: true,
            error: null
        };
        const action = fetchLatestSuccess([1, 2, 3, 4, 5]);
        const expectedState = {
            articleIds: [1, 2, 3, 4, 5],
            loading: false,
            error: null
        };
        expect(latestSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle fetchLatestFailure', () => {
        const initialState = {
            articleIds: [],
            loading: true,
            error: null
        };
        const action = fetchLatestFailure('no data found');
        const expectedState = {
            articleIds: [],
            loading: false,
            error: 'no data found'
        };
        expect(latestSlice.reducer(initialState, action)).toEqual(expectedState);
    });
})