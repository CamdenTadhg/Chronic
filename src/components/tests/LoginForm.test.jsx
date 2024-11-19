import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react';
import {it, expect, vi} from 'vitest';
import '@testing-library/jest-dom';
import {MemoryRouter} from 'react-router-dom';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import LoginForm from '../LoginForm';
import rootReducer from '../../redux/reducers/rootReducer';
import ChronicAPI from '../../api/chronicAPI';

vi.mock('../../api/chronicAPI');

it('renders without errors', () => {
    const store = configureStore({reducer: rootReducer});
    render(
        <Provider store={store}>
            <MemoryRouter>
                <LoginForm/>
            </MemoryRouter>
        </Provider>
    )
});

it('matches the snapshot', () => {
    const store = configureStore({reducer: rootReducer});
    const loginForm = render(
        <Provider store={store}>
            <MemoryRouter>
                <LoginForm/>
            </MemoryRouter>
        </Provider>
    );
    expect(loginForm).toMatchSnapshot();
});

it('displays the appropriate content', () => {
    const store = configureStore({reducer: rootReducer});
    const {getByText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <LoginForm/>
            </MemoryRouter>
        </Provider>
    );
    expect(getByText('Login Form')).toBeInTheDocument();
});

it('logs a user in and gathers their data', async () => {
    const store = configureStore({reducer: rootReducer, preloadedState: {
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
    }});
    ChronicAPI.signin = vi.fn();
    ChronicAPI.signin.mockResolvedValue({userId: 3});
    ChronicAPI.getUser = vi.fn();
    ChronicAPI.getUser.mockResolvedValue({
        userId: 3,
        email: 'test@test.com', 
        name: 'Test User',
        isAdmin: false,
        lastLogin: '2024-11-07T10:00:00.000Z',
        diagnoses: [
            {
                diagnosis: 'Chronic fatigue syndrome', 
                keywords: ['CFS', 'ME', 'myalgic myenchephalitis']
            }
        ],
        symptoms: ['fatigue', 'brain fog'],
        medications: [
            {
                medication: 'LDN', 
                dosageNum: 10,
                dosageUnit: 'mg', 
                timeOfDay: ['Evening']
            }
        ]
    });
    ChronicAPI.getSymptomTrackingRecords = vi.fn();
    ChronicAPI
        .getSymptomTrackingRecords.mockResolvedValueOnce({
            fatigue: {},
            'brain fog': {}
        });
    ChronicAPI.getSymptomTrackingRecords.mockResolvedValueOnce({
        fatigue: {
            '12-4 AM': 3,
            '8 AM-12 PM': 2,
            '12-4 PM': 1
        },
        'brain fog': {
            '12-4 AM': 2
        }
    });
    ChronicAPI.getMedTrackingRecords = vi.fn();
    ChronicAPI.getMedTrackingRecords.mockResolvedValueOnce({
        AM: {},
        Midday: {},
        PM: {},
        Evening: {
            LDN: null
        }
    });
    ChronicAPI.getMedTrackingRecords.mockResolvedValueOnce({
        AM: {},
        Midday: {},
        PM: {},
        Evening: {
            LDN: 1
        }
    });
    const toggleLoginModal = vi.fn();
    const {getByText, getByLabelText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <LoginForm toggleLoginModal={toggleLoginModal}/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('Email'), {target: {value: 'test@test.com'}});
        fireEvent.change(getByLabelText('Password'), {target: {value: 'Password1!'}});
        fireEvent.click(getByText('Log in'));
    });
    expect(ChronicAPI.signin).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'Password1!'
    });
    await waitFor(() => {
        expect(store.getState()).toEqual({
            profile: {
                userId: 3,
                email: 'test@test.com',
                name: 'Test User',
                isAdmin: false,
                lastLogin: '2024-11-07T10:00:00.000Z',
                diagnoses: [
                    {
                        diagnosis: 'Chronic fatigue syndrome', 
                        keywords: ['CFS', 'ME', 'myalgic myenchephalitis']
                    }
                ],
                symptoms: ['fatigue', 'brain fog'],
                medications: [
                    {
                        medication: 'LDN', 
                        dosageNum: 10,
                        dosageUnit: 'mg', 
                        timeOfDay: ['Evening']
                    }
                ],
                loading: false,
                error: null,
                history: {}
            },
            tracking: {
                primaryTracking: {
                    symptoms: {
                        fatigue: {},
                        'brain fog': {}
                    },
                    medications: {
                        AM: {},
                        Midday: {},
                        PM: {},
                        Evening: {
                            LDN: null
                        }
                    }
                },
                secondaryTracking: {
                    symptoms: {
                        fatigue: {
                            '12-4 AM': 3,
                            '8 AM-12 PM': 2,
                            '12-4 PM': 1
                        },
                        'brain fog': {
                            '12-4 AM': 2
                        }
                    },
                    medications: {
                        AM: {},
                        Midday: {},
                        PM: {},
                        Evening: {
                            LDN: 1
                        }
                    }
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
                articleIds:[],
                loading: true,
                error: null
            }
        });
    });
    expect(toggleLoginModal).toHaveBeenCalled();
});

it('displays an error for invalid data', () => {
    const store = configureStore({reducer: rootReducer})
    const {getByLabelText, getByText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <LoginForm/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('Email'), {target: {value: 'testtestcom'}});
        fireEvent.change(getByLabelText('Password'), {target: {value: 'password'}});
    });
    expect(getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(getByText('Passwords must be 8 characters and contain at least one letter, one number, and one special character')).toBeInTheDocument();
});

it('displays an error from the api', async () => {
    const store = configureStore({reducer: rootReducer});
    ChronicAPI.signin = vi.fn();
    ChronicAPI.signin.mockRejectedValue(['Invalid password']);
    const toggleLoginModal = vi.fn();
    const {getByText, getByLabelText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <LoginForm toggleLoginModal={toggleLoginModal}/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('Email'), {target: {value: 'test@test.com'}});
        fireEvent.change(getByLabelText('Password'), {target: {value: 'password1!'}});
        fireEvent.click(getByText('Log in'));
    });
    expect(ChronicAPI.signin).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password1!'
    });
    await waitFor(() => {
        expect(getByText('Invalid password')).toBeInTheDocument();
    })
    await waitFor(() => {
        expect(store.getState()).toEqual({
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
        });
    });
});