import {combineReducers} from 'redux';
import profileReducer from './profileReducer';
import trackingReducer from './trackingReducer';
import dataReducer from './dataReducer';
import latestReducer from './latestReducer';

const rootReducer = combineReducers({
    profile: profileReducer,
    tracking: trackingReducer,
    data: dataReducer,
    latest: latestReducer
});

export default rootReducer;