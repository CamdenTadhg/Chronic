import {
    fetchLatest
} from '../latestThunks';
import {describe, it, expect, vi} from 'vitest';

vi.mock('../../../api/chronicAPI', () => {
    const mockGetArticleIds = vi.fn();
    return {
        default: {
            getArticleIds: vi.fn()
        }
    }
});

import ChronicAPI from '../../../api/chronicAPI';

describe('fetchLatest', () => {
    it('dispatches correct actions on successful request', async () => {
        ChronicAPI.getArticleIds.mockResolvedValue([1, 2, 3, 4, 5]);
        const dispatch = vi.fn();
        await fetchLatest(['chronic fatigue syndrome', 'POTS'])(dispatch);

        expect(dispatch).toHaveBeenCalledWith({type: 'latest/fetchLatestRequest'});
        expect(dispatch).toHaveBeenCalledWith({
            type: 'latest/fetchLatestSuccess',
            payload: [1, 2, 3, 4, 5]
        });
    });
    it('dispatches correct actions on error', async () => {
        ChronicAPI.getArticleIds.mockRejectedValue(new Error('I am an error message'));
        const dispatch = vi.fn();
        await fetchLatest(['chronic fatigue syndrome', 'POTS'])(dispatch);

        expect(dispatch).toHaveBeenCalledWith({type: 'latest/fetchLatestRequest'});
        expect(dispatch).toHaveBeenCalledWith({
            type: 'latest/fetchLatestFailure',
            payload: 'I am an error message'
    })
    });
})