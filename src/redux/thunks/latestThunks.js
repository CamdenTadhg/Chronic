import {
    fetchLatestRequest,
    fetchLatestSuccess,
    fetchLatestFailure
} from '../reducers/latestReducer';
import ChronicAPI from '../../api/chronicAPI';

//thunk to dispatch actions and handle asyncronous API calls for the latest current awareness feature of the site

export const fetchLatest = (keywords=['chronic illness']) => {
    return async (dispatch) => {
        dispatch(fetchLatestRequest());
        try {
            const articleIds = await ChronicAPI.getArticleIds(keywords);
            dispatch(fetchLatestSuccess(articleIds));
        } catch (error) {
            dispatch(fetchLatestFailure(error.message || 'failed to fetch latest article ids'));
        }
    }
}