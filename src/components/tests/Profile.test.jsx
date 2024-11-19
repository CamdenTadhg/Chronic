import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react';
import {it, expect, vi} from 'vitest';
import '@testing-library/jest-dom';
import {MemoryRouter} from 'react-router-dom';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import Profile from '../Profile';
import rootReducer from '../../redux/reducers/rootReducer';
import ChronicAPI from '../../api/chronicAPI';
import { afterEach } from 'node:test';

vi.mock('../../api/chronicAPI');

afterEach(() => {
    vi.restoreAllMocks();
});

it('renders without error', async () => {
    const store = configureStore({reducer: rootReducer});
    await waitFor(() => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Profile/>
                </MemoryRouter>
            </Provider>
        );
    });
});

it('matches the snapshot', async () => {
    const store = configureStore({reducer: rootReducer});
    const profile = render (
        <Provider store={store}>
            <MemoryRouter>
                <Profile/>
            </MemoryRouter>
        </Provider>
    );
    await waitFor(() => {
        expect(profile).toMatchSnapshot();
    })
});

it('displays the appropriate content', async () => {
    const store = configureStore({reducer: rootReducer});
    const {getByText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <Profile/>
            </MemoryRouter>
        </Provider>
    );
    await waitFor(() => {
        expect(getByText('Save Profile')).toBeInTheDocument();
    })
});

it('fills the form with the profile data', async () => {
    const store = configureStore({reducer: rootReducer, preloadedState: {
        profile: {
            userId: 3,
            email: 'test@test.com',
            name: 'Test User', 
            isAdmin: false,
            since: '2024-11-01T01:00:00.000Z',
            lastLogin: '2024-11-01T01:00:00.000Z',
            diagnoses: [
                {diagnosisId: 1, diagnosis: 'down syndrome', keywords: ['intellectual disability']},
                {diagnosisId: 2, diagnosis: 'chronic obstructive pulmonary disease', keywords: ['COPD', 'shortness of breath']},
                {diagnosisId: 3, diagnosis: 'myalgic encephalomyelitis', keywords: ['chronic fatigue syndrome']}
            ],
            symptoms: [],
            medications: [],
            loading: false, 
            error: null,
            history: {}
        }
    }});
    const {getByText, getByDisplayValue} = render (
        <Provider store={store}>
            <MemoryRouter>
                <Profile/>
            </MemoryRouter>
        </Provider>
    );
    await waitFor(() => {
        expect(getByDisplayValue('test@test.com')).toBeInTheDocument();
        expect(getByText('down syndrome')).toBeInTheDocument();
    });
});

it('updates the user profile in the database and store', async () => {
    const store = configureStore({reducer: rootReducer, preloadedState: {
        profile: {
            userId: 3,
            email: 'test@test.com',
            name: 'Test User', 
            isAdmin: false,
            since: '2024-11-01T01:00:00.000Z',
            lastLogin: '2024-11-01T01:00:00.000Z',
            diagnoses: [
                {diagnosisId: 1, diagnosis: 'down syndrome', keywords: []},
                {diagnosisId: 2, diagnosis: 'chronic obstructive pulmonary disease', keywords: []},
                {diagnosisId: 3, diagnosis: 'myalgic encephalomyelitis', keywords: []}
            ],
            symptoms: [],
            medications: [],
            loading: false, 
            error: null,
            history: {}
    }}});
    ChronicAPI.editUser = vi.fn();
    ChronicAPI.editUser.mockResolvedValue({userId: 3, email: 'test1@test.com', name: 'Test User', isAdmin: false});
    const {getByText, getByLabelText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('Email'), {target: {value: 'test1@test.com'}});
        fireEvent.click(getByText('Save Profile'));
    });
    await waitFor(() => {
        expect(ChronicAPI.editUser).toHaveBeenCalledWith(3, {email: 'test1@test.com', name: 'Test User'});
        expect(store.getState()).toEqual({
            profile: {
                userId: 3,
                email: 'test1@test.com',
                name: 'Test User', 
                isAdmin: false,
                since: '2024-11-01T01:00:00.000Z',
                lastLogin: '2024-11-01T01:00:00.000Z',
                diagnoses: [
                    {diagnosisId: 1, diagnosis: 'down syndrome', keywords: []},
                    {diagnosisId: 2, diagnosis: 'chronic obstructive pulmonary disease', keywords: []},
                    {diagnosisId: 3, diagnosis: 'myalgic encephalomyelitis', keywords: []}
                ],
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
    });
    });
});

it('displays an email validation error and stops form submission', async () => {
    const store = configureStore({reducer: rootReducer, preloadedState: {
        profile: {
            userId: 3,
            email: 'test@test.com',
            name: 'Test User', 
            isAdmin: false,
            since: '2024-11-01T01:00:00.000Z',
            lastLogin: '2024-11-01T01:00:00.000Z',
            diagnoses: [
                {diagnosisId: 1, diagnosis: 'down syndrome', keywords: []},
                {diagnosisId: 2, diagnosis: 'chronic obstructive pulmonary disease', keywords: []},
                {diagnosisId: 3, diagnosis: 'myalgic encephalomyelitis', keywords: []}
            ],
            symptoms: [],
            medications: [],
            loading: false, 
            error: null,
            history: {}
    }}});
    ChronicAPI.editUser = vi.fn();
    ChronicAPI.editUser.mockResolvedValue({userId: 3, email: 'test1@test.com', name: 'Test User', isAdmin: false});
    const {getByText, getByLabelText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('Email'), {target: {value: 'test1test.com'}});
        fireEvent.click(getByText('Save Profile'));
    });
    await waitFor(() => {
        expect(getByText('Please enter a valid email address.')).toBeInTheDocument();
        expect(ChronicAPI.editUser).not.toHaveBeenCalled();
        expect(store.getState()).toEqual({
            profile: {
                userId: 3,
                email: 'test@test.com',
                name: 'Test User', 
                isAdmin: false,
                since: '2024-11-01T01:00:00.000Z',
                lastLogin: '2024-11-01T01:00:00.000Z',
                diagnoses: [
                    {diagnosisId: 1, diagnosis: 'down syndrome', keywords: []},
                    {diagnosisId: 2, diagnosis: 'chronic obstructive pulmonary disease', keywords: []},
                    {diagnosisId: 3, diagnosis: 'myalgic encephalomyelitis', keywords: []}
                ],
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
            }});
    });
});

it('displays an error from the api on profile update', async () => {
    const store = configureStore({reducer: rootReducer, preloadedState: {
        profile: {
            userId: 3,
            email: 'test@test.com',
            name: 'Test User', 
            isAdmin: false,
            since: '2024-11-01T01:00:00.000Z',
            lastLogin: '2024-11-01T01:00:00.000Z',
            diagnoses: [
                {diagnosisId: 1, diagnosis: 'down syndrome', keywords: []},
                {diagnosisId: 2, diagnosis: 'chronic obstructive pulmonary disease', keywords: []},
                {diagnosisId: 3, diagnosis: 'myalgic encephalomyelitis', keywords: []}
            ],
            symptoms: [],
            medications: [],
            loading: false, 
            error: null,
            history: {}
    }}});
    ChronicAPI.editUser = vi.fn();
    ChronicAPI.editUser.mockRejectedValue('There is a problem with the API');
    const {getByText, getByLabelText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('Email'), {target: {value: 'test1@test.com'}});
        fireEvent.click(getByText('Save Profile'));
    });
    await waitFor(() => {
        expect(getByText('There is a problem with the API')).toBeInTheDocument();
        expect(store.getState()).toEqual({
            profile: {
                userId: 3,
                email: 'test@test.com',
                name: 'Test User', 
                isAdmin: false,
                since: '2024-11-01T01:00:00.000Z',
                lastLogin: '2024-11-01T01:00:00.000Z',
                diagnoses: [
                    {diagnosisId: 1, diagnosis: 'down syndrome', keywords: []},
                    {diagnosisId: 2, diagnosis: 'chronic obstructive pulmonary disease', keywords: []},
                    {diagnosisId: 3, diagnosis: 'myalgic encephalomyelitis', keywords: []}
                ],
                symptoms: [],
                medications: [],
                loading: false, 
                error: 'There is a problem with the API',
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
            }});
    });
});

it('opens the password modal', async () => {
    const store = configureStore({reducer: rootReducer});
    const {getByText} = render (
        <Provider store={store}>
            <MemoryRouter>
                <Profile/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.click(getByText('Change Password'));
    });
    await waitFor(() => {
        expect(getByText('Update')).toBeInTheDocument();
    });
});

it('opens the diagnosis modal', async () => {
    const store = configureStore({reducer: rootReducer});
    const {getByText} = render (
        <Provider store={store}>
            <MemoryRouter>
                <Profile/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.click(getByText('Add a Diagnosis'));
    });
    await waitFor(() => {
        expect(getByText('Add Diagnosis')).toBeInTheDocument();
    })
});

it('opens a keyword modal', async () => {
    const store = configureStore({reducer: rootReducer, preloadedState: {
        profile: {
            userId: 3,
            email: 'test@test.com',
            name: 'Test User', 
            isAdmin: false,
            since: '2024-11-01T01:00:00.000Z',
            lastLogin: '2024-11-01T01:00:00.000Z',
            diagnoses: [
                {diagnosisId: 1, diagnosis: 'down syndrome', keywords: []}
            ],
            symptoms: [],
            medications: [],
            loading: false, 
            error: null,
            history: {}
    }}});
    const {getByText} = render (
        <Provider store={store}>
            <MemoryRouter>
                <Profile/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.click(getByText('Keywords'));
    });
    await waitFor(() => {
        expect(getByText('Change Keywords')).toBeInTheDocument();
    })
});

it('disconnects a user and diagnosis in the database and store', async () => {
    const store = configureStore({reducer: rootReducer, preloadedState: {
        profile: {
            userId: 3,
            email: 'test@test.com',
            name: 'Test User', 
            isAdmin: false,
            since: '2024-11-01T01:00:00.000Z',
            lastLogin: '2024-11-01T01:00:00.000Z',
            diagnoses: [
                {diagnosisId: 1, diagnosis: 'down syndrome', keywords: []}
            ],
            symptoms: [],
            medications: [],
            loading: false, 
            error: null,
            history: {}
    }}});
    ChronicAPI.disconnectUserDiagnosis = vi.fn();
    ChronicAPI.disconnectUserDiagnosis.mockResolvedValue(['User 3', 'Diagnosis 3']);
    const {getByTestId, queryByText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.click(getByTestId('delete-button'));
    });
    await waitFor(() => {
        expect(queryByText('down syndrome')).not.toBeInTheDocument();
        expect(store.getState()).toEqual({
            profile: {
                userId: 3,
                email: 'test@test.com',
                name: 'Test User', 
                isAdmin: false,
                since: '2024-11-01T01:00:00.000Z',
                lastLogin: '2024-11-01T01:00:00.000Z',
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
            }});
    });
});

it('displays an error from the api on user/diagnosis disconnect', async () => {
    const store = configureStore({reducer: rootReducer, preloadedState: {
        profile: {
            userId: 3,
            email: 'test@test.com',
            name: 'Test User', 
            isAdmin: false,
            since: '2024-11-01T01:00:00.000Z',
            lastLogin: '2024-11-01T01:00:00.000Z',
            diagnoses: [
                {diagnosisId: 1, diagnosis: 'down syndrome', keywords: []}
            ],
            symptoms: [],
            medications: [],
            loading: false, 
            error: null,
            history: {}
    }}});
    ChronicAPI.disconnectUserDiagnosis = vi.fn();
    ChronicAPI.disconnectUserDiagnosis.mockRejectedValue('There is a problem with the API');
    const {getByTestId, queryByText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.click(getByTestId('delete-button'));
    });
    await waitFor(() => {
        expect(queryByText('down syndrome')).toBeInTheDocument();
        expect(queryByText('There is a problem with the API')).toBeInTheDocument();
        expect(store.getState()).toEqual({
            profile: {
                userId: 3,
                email: 'test@test.com',
                name: 'Test User', 
                isAdmin: false,
                since: '2024-11-01T01:00:00.000Z',
                lastLogin: '2024-11-01T01:00:00.000Z',
                diagnoses: [
                    {diagnosisId: 1, diagnosis: 'down syndrome', keywords: []}
                ],
                symptoms: [],
                medications: [],
                loading: false, 
                error: 'There is a problem with the API',
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
            }});
    });
});