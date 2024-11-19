import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react';
import {it, expect, vi} from 'vitest';
import '@testing-library/jest-dom';
import {MemoryRouter} from 'react-router-dom';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import SignupForm from '../SignupForm';
import rootReducer from '../../redux/reducers/rootReducer';
import ChronicAPI from '../../api/chronicAPI';

vi.mock('../../api/chronicAPI');

it('renders without error', () => {
    const store = configureStore({reducer: rootReducer});
    render(
        <Provider store={store}>
            <MemoryRouter>
                <SignupForm/>
            </MemoryRouter>
        </Provider>
    )
});

it('matches the snapshot', () => {
    const store = configureStore({reducer: rootReducer})
    const signupForm = render(
        <Provider store={store}>
            <MemoryRouter>
                <SignupForm/>
            </MemoryRouter>
        </Provider>
    );
    expect(signupForm).toMatchSnapshot();
});

it('displays the appropriate content', () => {
    const store = configureStore({reducer: rootReducer})
    const {getByText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <SignupForm/>
            </MemoryRouter>
        </Provider>
    );
    expect(getByText('Signup Form')).toBeInTheDocument();
});

it('signs a user up and logs them in', async () => {
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
        }
    }})
    ChronicAPI.register = vi.fn();
    ChronicAPI.register.mockResolvedValue({userId: 3});
    ChronicAPI.getUser = vi.fn();
    ChronicAPI.getUser.mockResolvedValue({userId: 3, email: 'test@test.com', name: 'Test User', lastLogin:'2024-11-01T01:00:00.000Z'});
    const toggleSignupModal = vi.fn();
    const {getByText, getByLabelText, getByPlaceholderText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <SignupForm toggleSignupModal={toggleSignupModal}/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('Email'), {target: {value: 'test@test.com'}});
        fireEvent.change(getByLabelText('Password'), {target: {value: 'password1!'}});
        fireEvent.change(getByPlaceholderText('confirm password'), {target: {value: 'password1!'}});
        fireEvent.change(getByLabelText('Name'), {target: {value: 'Test User'}});
        fireEvent.click(getByText('Sign up'));
    });
    expect(ChronicAPI.register).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password1!', 
        name: 'Test User'
    });
    await waitFor(() => {
        expect(store.getState()).toEqual({
            profile: {
                userId: 3,
                email: 'test@test.com',
                name: 'Test User', 
                isAdmin: false,
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
            }
        });
        expect(toggleSignupModal).toHaveBeenCalled();
    })
});

it('displays an error for invalid data', () => {
    const store = configureStore({reducer: rootReducer})
    const {getByLabelText, getByPlaceholderText, getByText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <SignupForm/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('Email'), {target: {value: 'testtestcom'}});
        fireEvent.change(getByLabelText('Password'), {target: {value: 'password'}});
        fireEvent.change(getByPlaceholderText('confirm password'), {target: {value: 'passwor'}});
        fireEvent.change(getByLabelText('Name'), {target: {value: 'Test User'}});
    });
    expect(getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(getByText('Passwords must be 8 characters and contain at least one letter, one number, and one special character')).toBeInTheDocument();
    expect(getByText('Passwords do not match')).toBeInTheDocument();
});

it('displays an error from the api', async () => {
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
        }
    }})
    ChronicAPI.register = vi.fn();
    ChronicAPI.register.mockRejectedValue(['There is already an account with that email']);
    const toggleSignupModal = vi.fn();
    const {getByText, getByLabelText, getByPlaceholderText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <SignupForm toggleSignupModal={toggleSignupModal}/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('Email'), {target: {value: 'test@test.com'}});
        fireEvent.change(getByLabelText('Password'), {target: {value: 'password1!'}});
        fireEvent.change(getByPlaceholderText('confirm password'), {target: {value: 'password1!'}});
        fireEvent.change(getByLabelText('Name'), {target: {value: 'Test User'}});
        fireEvent.click(getByText('Sign up'));
    });
    expect(ChronicAPI.register).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password1!', 
        name: 'Test User'
    });
    await waitFor(() => {
        expect(getByText('There is already an account with that email')).toBeInTheDocument();
    })
    await waitFor(() => {
        expect(store.getState()).toEqual({
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
        });
    });
});