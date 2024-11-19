import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react';
import {it, expect, vi} from 'vitest';
import '@testing-library/jest-dom';
import {MemoryRouter} from 'react-router-dom';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import PasswordForm from '../PasswordForm';
import rootReducer from '../../redux/reducers/rootReducer';
import ChronicAPI from '../../api/chronicAPI';

vi.mock('../../api/chronicAPI');

it('renders without error', () => {
    const store = configureStore({reducer: rootReducer});
    render(
        <Provider store={store}>
            <MemoryRouter>
                <PasswordForm/>
            </MemoryRouter>
        </Provider>
    )
});

it('matches the snapshot', () => {
    const store = configureStore({reducer: rootReducer})
    const signupForm = render(
        <Provider store={store}>
            <MemoryRouter>
                <PasswordForm/>
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
                <PasswordForm/>
            </MemoryRouter>
        </Provider>
    );
    expect(getByText('Change Password')).toBeInTheDocument();
});

it(`changes a user's password`, async () => {
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
    ChronicAPI.editUser.mockResolvedValue({userId: 3, email: 'test@test.com', name: 'Test User', isAdmin: false});
    const togglePasswordModal = vi.fn();
    const {getByText, getByLabelText, getByPlaceholderText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <PasswordForm togglePasswordModal={togglePasswordModal}/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('Password'), {target: {value: 'password1!'}});
        fireEvent.change(getByPlaceholderText('confirm password'), {target: {value: 'password1!'}});
        fireEvent.click(getByText('Update'));
    });
    expect(ChronicAPI.editUser).toHaveBeenCalledWith(3, {
        password: 'password1!'
    });
    await waitFor(() => {
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
            }
        });
        expect(togglePasswordModal).toHaveBeenCalled();
    });
});

it('displays an error for invalid data', () => {
    const store = configureStore({reducer: rootReducer})
    const {getByLabelText, getByPlaceholderText, getByText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <PasswordForm/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('Password'), {target: {value: 'password'}});
        fireEvent.change(getByPlaceholderText('confirm password'), {target: {value: 'passwor'}});
    });
    expect(getByText('Passwords must be 8 characters and contain at least one letter, one number, and one special character')).toBeInTheDocument();
    expect(getByText('Passwords do not match')).toBeInTheDocument();
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
    ChronicAPI.editUser = vi.fn();
    ChronicAPI.editUser.mockRejectedValue(['there is a problem with the API']);
    const togglePasswordModal = vi.fn();
    const {getByText, getByLabelText, getByPlaceholderText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <PasswordForm togglePasswordModal={togglePasswordModal}/>
            </MemoryRouter>
        </Provider>
    );
    act(() => {
        fireEvent.change(getByLabelText('Password'), {target: {value: 'password1!'}});
        fireEvent.change(getByPlaceholderText('confirm password'), {target: {value: 'password1!'}});
        fireEvent.click(getByText('Update'));
    });
    expect(ChronicAPI.editUser).toHaveBeenCalledWith(3, {
        password: 'password1!', 
    });
    await waitFor(() => {
        expect(getByText('there is a problem with the API')).toBeInTheDocument();
    })
    await waitFor(() => {
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
    });
});