import rootReducer from '../rootReducer';
import {logoutAction} from  '../../actions/logout';
import {it, expect} from 'vitest';

it('correctly initializes the entire redux state', () => {
    const expectedState = {
        profile: {
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
        },
        tracking: {
            primaryTracking: {
                symptoms: {},
                medications: {}
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: null,
            history: {}
        }, 
        data: {
            symptoms: {},
            medications: {},
            loading: false,
            error: null
        },
        latest: {
            articleIds: [],
            loading: true,
            error: null
        }
    };
    expect(rootReducer(undefined, {type: undefined})).toEqual(expectedState);
});

it('correctly handles logout and clears data', () => {
    const initialState = {
        profile: {
            userId: 1,
            email: 'u1@test.com',
            name: 'U1',
            isAdmin: false,
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
        },
        tracking: {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: false,
            error: null,
            history: {}
        },
        data: {
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
        }, 
        latest: {
            articleIds: [1, 2, 3, 4],
            loading: false,
            error: null
        }
    };
    const action = logoutAction();
    const expectedState = {        
        profile: {
            userId: null,
            email: '',
            name: '',
            isAdmin: false,
            lastLogin: '',
            diagnoses: [],
            symptoms: [],
            medications: [],
            loading: false,
            error: null,
            history: {}
        },
        tracking: {
            primaryTracking: {
                symptoms: {},
                medications: {}
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: null,
            history: {}
        }, 
        data: {
            symptoms: {},
            medications: {},
            loading: false,
            error: null
        },
        latest: {
            articleIds: [],
            loading: true,
            error: null
        }
    };
    expect(rootReducer(initialState, action)).toEqual(expectedState);
})