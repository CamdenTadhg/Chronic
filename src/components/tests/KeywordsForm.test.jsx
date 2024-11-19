import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react';
import {it, expect, vi} from 'vitest';
import '@testing-library/jest-dom';
import {MemoryRouter} from 'react-router-dom';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import KeywordsForm from '../KeywordsForm';
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
                    <KeywordsForm/>
                </MemoryRouter>
            </Provider>
        );
    });
});

it('matches the snapshot', async () => {
    const store = configureStore({reducer: rootReducer});
    const keywordsForm = render(
        <Provider store={store}>
            <MemoryRouter>
                <KeywordsForm/>
            </MemoryRouter>
        </Provider>
    );
    await waitFor(() => {
        expect(keywordsForm).toMatchSnapshot();
    });
});

it('displays the appropriate content', async () => {
    const store = configureStore({reducer: rootReducer});
    const {getByText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <KeywordsForm/>
            </MemoryRouter>
        </Provider>
    );
    await waitFor(() => {
        expect(getByText('Change Keywords')).toBeInTheDocument();
    })
});

it('fills the form with the current data', async () => {
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
    const {getByDisplayValue} = render(
        <Provider store={store}>
            <MemoryRouter>
                <KeywordsForm diagnosisId={2}/>
            </MemoryRouter>
        </Provider>
    );
    await waitFor(() => {
        expect(getByDisplayValue('chronic obstructive pulmonary disease')).toBeInTheDocument();
        expect(getByDisplayValue('COPD, shortness of breath')).toBeInTheDocument();
    })
});

it('adds a single new keyword to the database and the store', async () => {
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
    ChronicAPI.updateUserDiagnosis = vi.fn();
    ChronicAPI.updateUserDiagnosis.mockResolvedValue({userId: 3, diagnosisId: 1, keywords: ['intellectual disability']});
    const toggleKeywordsModal = vi.fn();
    const {getByText, getByLabelText, getByDisplayValue} = render(
        <Provider store={store}>
            <MemoryRouter>
                <KeywordsForm toggleKeywordsModal={toggleKeywordsModal} diagnosisId={1}/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('New Keywords'), {target: {value: 'intellectual disability'}});
        fireEvent.click(getByText('Save'));
    });
    await waitFor(() => {
        expect(ChronicAPI.updateUserDiagnosis).toHaveBeenCalledWith(1, 3, 
            {keywords: ['intellectual disability']}, 
    );
        expect(store.getState()).toEqual({
            profile: {
                userId: 3,
                email: 'test@test.com',
                name: 'Test User', 
                isAdmin: false,
                since: '2024-11-01T01:00:00.000Z',
                lastLogin: '2024-11-01T01:00:00.000Z',
                diagnoses: [
                    {diagnosisId: 1, diagnosis: 'down syndrome', keywords: ['intellectual disability']},
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
        expect(getByDisplayValue('intellectual disability')).toBeInTheDocument();
    });
});

it('adds multiple new keywords to the database and the store', async () => {
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
    ChronicAPI.updateUserDiagnosis = vi.fn();
    ChronicAPI.updateUserDiagnosis.mockResolvedValue({userId: 3, diagnosisId: 2, keywords: ['COPD', 'shortness of breath']});
    const toggleKeywordsModal = vi.fn();
    const {getByText, getByLabelText, getByDisplayValue} = render(
        <Provider store={store}>
            <MemoryRouter>
                <KeywordsForm toggleKeywordsModal={toggleKeywordsModal} diagnosisId={2}/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('New Keywords'), {target: {value: 'COPD, shortness of breath'}});
        fireEvent.click(getByText('Save'));
    });
    await waitFor(() => {
        expect(ChronicAPI.updateUserDiagnosis).toHaveBeenCalledWith(2, 3, 
            {keywords: ['COPD', 'shortness of breath']}, 
    );
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
                    {diagnosisId: 2, diagnosis: 'chronic obstructive pulmonary disease', keywords: ['COPD', 'shortness of breath']},
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
        expect(getByDisplayValue('COPD, shortness of breath')).toBeInTheDocument();
    });
});

it('displays an error on invalid input', async () => {
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
    ChronicAPI.updateUserDiagnosis = vi.fn();
    ChronicAPI.updateUserDiagnosis.mockResolvedValue({userId: 3, diagnosisId: 3, keywords: ['"chronic fatigue syndrome"']});
    const toggleKeywordsModal = vi.fn();
    const {getByText, getByLabelText, getByDisplayValue} = render(
        <Provider store={store}>
            <MemoryRouter>
                <KeywordsForm toggleKeywordsModal={toggleKeywordsModal} diagnosisId={3}/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('New Keywords'), {target: {value: '"chronic fatigue syndrome"'}});
    });
    await waitFor(() => {
        expect(ChronicAPI.updateUserDiagnosis).not.toHaveBeenCalled();
        expect(getByText('Please enter keywords without quotes separated by commas')).toBeInTheDocument();
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
            }
        });
    });
});

it('displays an error from the api', async () => {
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
    ChronicAPI.updateUserDiagnosis = vi.fn();
    ChronicAPI.updateUserDiagnosis.mockRejectedValue('There is a problem with the API');
    const toggleKeywordsModal = vi.fn();
    const {getByText, getByLabelText, getByDisplayValue} = render(
        <Provider store={store}>
            <MemoryRouter>
                <KeywordsForm toggleKeywordsModal={toggleKeywordsModal} diagnosisId={3}/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('New Keywords'), {target: {value: 'chronic fatigue syndrome'}});
        fireEvent.click(getByText('Save'));
    });
    await waitFor(() => {
        expect(getByText('There is a problem with the API')).toBeInTheDocument();
        expect(ChronicAPI.updateUserDiagnosis).toHaveBeenCalledWith(3, 3, {keywords: ['chronic fatigue syndrome']});
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
            }
        });
    });
});