import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react';
import {it, expect, vi} from 'vitest';
import '@testing-library/jest-dom';
import {MemoryRouter} from 'react-router-dom';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import DiagnosisForm from '../DiagnosisForm';
import rootReducer from '../../redux/reducers/rootReducer';
import ChronicAPI from '../../api/chronicAPI';

vi.mock('../../api/chronicAPI');

afterEach(() => {
    vi.restoreAllMocks();
})

it('renders without error', async () => {
    const store = configureStore({reducer: rootReducer});
    await waitFor(() => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DiagnosisForm/>
                </MemoryRouter>
            </Provider>
        )
    })
});

it('matches the snapshot', async () => {
    const store = configureStore({reducer: rootReducer});
    const diagnosisForm = render(
        <Provider store={store}>
            <MemoryRouter>
                <DiagnosisForm/>
            </MemoryRouter>
        </Provider>
    );
    await waitFor(() => {
        expect(diagnosisForm).toMatchSnapshot();
    })
});

it('displays the appropriate content', async () => {
    const store = configureStore({reducer: rootReducer});
    const {getByText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <DiagnosisForm/>
            </MemoryRouter>
        </Provider>
    );
    await waitFor(() => {
        expect(getByText('Add Diagnosis')).toBeInTheDocument();
    })
});

it('displays suggested autocompletes based on user entries', async () => {
    const store = configureStore({reducer:rootReducer});
    ChronicAPI.getAllDiagnoses = vi.fn();
    ChronicAPI.getAllDiagnoses.mockResolvedValue([{id: 1, diagnosis: 'migraines', synonyms: []}, {id: 2, diagnosis: 'myocardial infarction', synonyms: ['heart attack']}, {id: 3, diagnosis: 'chronic fatigue', synonyms: ['CFS']}]);
    const {getByText, getByLabelText, queryByText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <DiagnosisForm/>
            </MemoryRouter>
        </Provider>
    );
    await waitFor(() => expect(ChronicAPI.getAllDiagnoses).toHaveBeenCalled());
    act(() => {
        fireEvent.change(getByLabelText('Diagnosis'), {target: {value: 'm'}});
    });
    await waitFor(() => {
        expect(getByText('migraines')).toBeInTheDocument();
        expect(getByText('myocardial infarction')).toBeInTheDocument();
        expect(queryByText('chronic fatigue')).not.toBeInTheDocument();
    });
});

it(`adds a new diagnosis to a user's record`, async () => {
    const store = configureStore({reducer: rootReducer, preloadedState: {
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
        }
    }});
    ChronicAPI.connectUserDiagnosis = vi.fn();
    ChronicAPI.getAllDiagnoses = vi.fn();
    ChronicAPI.connectUserDiagnosis.mockResolvedValue({userId: 3, email: 'test@test.com', name: 'Test User', isAdmin: false});
    ChronicAPI.getAllDiagnoses.mockResolvedValue([{id: 1, diagnosis: 'migraines', synonyms: []}, {id: 2, diagnosis: 'myocardial infarction', synonyms: ['heart attack']}]);
    const toggleDiagnosisModal = vi.fn();
    const {getByText, getByLabelText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <DiagnosisForm toggleDiagnosisModal={toggleDiagnosisModal}/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('Diagnosis'), {target: {value: 'COPD'}});
        fireEvent.change(getByLabelText('Keywords'), {target: {value: 'chronic obstructive pulmonary disease, pulmonary'}});
        fireEvent.click(getByText('Add'));
    });

    await waitFor(() => {
        expect(ChronicAPI.connectUserDiagnosis).toHaveBeenCalledWith(0, 3, {
            diagnosis: 'COPD',
            keywords: ['chronic obstructive pulmonary disease', 'pulmonary']
        });
        expect(store.getState()).toEqual({
            profile: {
                userId: 3,
                email: 'test@test.com',
                name: 'Test User', 
                isAdmin: false,
                since: '2024-11-01T01:00:00.000Z',
                lastLogin: '2024-11-01T01:00:00.000Z',
                diagnoses: [{
                    diagnosis: 'COPD',
                    keywords: ['chronic obstructive pulmonary disease', 'pulmonary']
                }],
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
        expect(toggleDiagnosisModal).toHaveBeenCalled();
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
            diagnoses: [],
            symptoms: [],
            medications: [],
            loading: false, 
            error: null,
            history: {}
        }
    }})
    ChronicAPI.connectUserDiagnosis = vi.fn();
    ChronicAPI.connectUserDiagnosis.mockRejectedValue(['there is a problem with the API']);
    const toggleDiagnosisModal = vi.fn();
    const {getByText, getByLabelText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <DiagnosisForm toggleDiagnosisModal={toggleDiagnosisModal}/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('Diagnosis'), {target: {value: 'COPD'}});
        fireEvent.change(getByLabelText('Keywords'), {target: {value: 'chronic obstructive pulmonary disease, pulmonary'}});
        fireEvent.click(getByText('Add'));
    });
    await waitFor(() => {
        expect(getByText('there is a problem with the API')).toBeInTheDocument();
    })
    await waitFor(() => {
        expect(ChronicAPI.connectUserDiagnosis).toHaveBeenCalledWith(0, 3, {
            diagnosis: 'COPD',
            keywords: ['chronic obstructive pulmonary disease', 'pulmonary']
        });
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
                error: ['there is a problem with the API'],
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
        expect(toggleDiagnosisModal).not.toHaveBeenCalled();
    });
});