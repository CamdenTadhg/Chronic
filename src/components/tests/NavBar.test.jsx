import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import {it, expect, vi} from 'vitest';
import '@testing-library/jest-dom';
import {MemoryRouter, useNavigate} from 'react-router-dom';
import rootReducer from '../../redux/reducers/rootReducer';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import NavBar from '../NavBar';
import ChronicAPI from '../../api/chronicAPI';

const Wrapper = ({children}) => {
    return (
        <MemoryRouter>
            {children}
        </MemoryRouter>
    );
};

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: vi.fn()
    }
});

it('renders without error', () => {
    const store = configureStore({reducer: rootReducer})
    render(
        <Provider store={store}>
            <Wrapper>
                <NavBar/>

            </Wrapper>
        </Provider>);
});

it('matches the snapshot', () => {
    const store = configureStore({reducer: rootReducer})
    const navbar = render(
        <Provider store={store}>
            <Wrapper>
                <NavBar/>
            </Wrapper>
        </Provider>
    );
    expect(navbar).toMatchSnapshot();
});

it('displays the appropriate content to a logged in user', () => {
    const store = configureStore({reducer: rootReducer})
    const {queryByText} = render(
        <Provider store={store}>
            <Wrapper>
                <NavBar/>
            </Wrapper>
        </Provider>);
    expect(queryByText('Login')).toBeInTheDocument();
});

it('displays the appropriate content to a logged out user', () => {
    const store = configureStore({reducer: rootReducer, preloadedState: {profile: {userId: 1}}})
    const {queryByText} = render(
        <Provider store={store}>
            <Wrapper>
                <NavBar/>
            </Wrapper>
        </Provider>);
    expect(queryByText('Logout')).toBeInTheDocument();
});

it('opens the login modal', () => {
    const store = configureStore({reducer: rootReducer})
    const {getByText} = render(
        <Provider store={store}>
            <Wrapper>
                <NavBar/>
            </Wrapper>
        </Provider>);
    fireEvent.click(getByText('Login'));
    expect(getByText('Login Form')).toBeInTheDocument();
});

it('opens the signup modal', () => {
    const store = configureStore({reducer: rootReducer})
    const {getByText} = render(
        <Provider store={store}>
            <Wrapper>
                <NavBar/>
            </Wrapper>
        </Provider>);
    fireEvent.click(getByText('Signup'));
    expect(getByText('Signup Form')).toBeInTheDocument();
});

it('calls the logout function and redirects to home', () => {
    const store = configureStore({reducer: rootReducer, preloadedState:{
        profile: {
            userId: 1,
            email: 'test@test.com',
            name: 'test user',
            isAdmin: false,
            lastLogin: '',
            diagnoses: [],
            symptoms: ['fatigue'],
            medications: ['propanalol'],
            loading: false,
            error: null,
            history: {}
        },
        tracking: {
            primaryTracking: {
                symptoms: {
                    fatigue: 'tracking data here'
                },
                medications: {
                    AM: {
                        propanalol: 'tracking data here'
                    }
                }
            },
            secondaryTracking: {
                symptoms: {
                    fatigue: 'tracking data here'
                },
                medications: {
                    AM: {
                        propanolol: 'tracking data here'
                    }
                }
            },
            loading: false,
            error: null,
            history: {}
        }, 
        data: {
            symptoms: {
                data: 'general data here'
            },
            medications: {
                data: 'general data here'
            },
            loading: false,
            error: null
        },
        latest: {
            articleIds: ['111', '222', '333'],
            loading: false,
            error: null
        }
    } });

    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    const {getByText} = render(
        <Provider store={store}>
            <Wrapper>
                <NavBar/>
            </Wrapper>
        </Provider>);
    fireEvent.click(getByText('Logout'));
    expect(getByText('Login')).toBeInTheDocument();
    expect(ChronicAPI.token).toEqual('');
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
    expect(mockNavigate).toHaveBeenCalledWith('/');
});

