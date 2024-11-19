import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import {it, expect, vi} from 'vitest';
import * as router from 'react-router';
import '@testing-library/jest-dom';
import {MemoryRouter} from 'react-router-dom';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import Home from '../Home';
import rootReducer from '../../redux/reducers/rootReducer';
import ChronicAPI from '../../api/chronicAPI';

const navigate = vi.fn();
vi.spyOn(router, 'useNavigate').mockImplementation(() => navigate);

it('renders without errors', () => {
    const store = configureStore({reducer:rootReducer});
    render(
        <Provider store={store}>
            <MemoryRouter>
                <Home/>
            </MemoryRouter>
        </Provider>
    )
});

it('matches the snapshot', () => {
    const store = configureStore({reducer: rootReducer});
    const home = render(
        <Provider store={store}>
            <MemoryRouter>
                <Home/>
            </MemoryRouter>
        </Provider>
    );
    expect(home).toMatchSnapshot();
});

it('displays the appropriate content to an anonymous user', () => {
    const store = configureStore({reducer: rootReducer});
    const {getByText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <Home/>
            </MemoryRouter>
        </Provider>
    );
    expect(getByText('Your Health. Your Data. Your Power.')).toBeInTheDocument();
});

it('displays the appropriate context to a logged in user', async () => {
    const store = configureStore({reducer: rootReducer, preloadedState: {
        profile: {
            userId: 7,
            diagnoses: [{
                diagnosis: 'chronic fatigue syndrome', 
                keywords: ['ME']
            }]
        }
    }});
    ChronicAPI.getArticleIds = vi.fn();
    ChronicAPI.getArticleIds.mockResolvedValue([1234,2233]);
    ChronicAPI.getArticles = vi.fn();
    ChronicAPI.getArticles.mockResolvedValue([
        {PMID: 2345, title: 'a test ME article', abstract: 'this is a test article about ME'},
        {PMID: 5732, title: 'a second test ME article', abstract: 'this is also a test article about ME'}
    ]);
    const {getByText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <Home/>
            </MemoryRouter>
        </Provider>
    );
    await waitFor(() => expect(getByText('To see your tracking data in a graph, click here')).toBeInTheDocument());
});

it('allows navigation to tracking and data pages', async () => {
    const store = configureStore({reducer: rootReducer, preloadedState: {
        profile: {
            userId: 7,
            diagnoses: [{
                diagnosis: 'chronic fatigue syndrome', 
                keywords: ['ME']
            }]
        }
    }});
    ChronicAPI.getArticleIds = vi.fn();
    ChronicAPI.getArticleIds.mockResolvedValue([1234,2233]);
    ChronicAPI.getArticles = vi.fn();
    ChronicAPI.getArticles.mockResolvedValue([
        {PMID: 2345, title: 'a test ME article', abstract: 'this is a test article about ME'},
        {PMID: 5732, title: 'a second test ME article', abstract: 'this is also a test article about ME'}
    ]);
    const {getByText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <Home/>
            </MemoryRouter>
        </Provider>
    );
    fireEvent.click(getByText('Tracking'));
    await waitFor(() => expect(navigate.mock.calls[0][0]).toBe('/tracking'));
    window.history.back();
    fireEvent.click(getByText('Data'));
    await waitFor(() => expect(navigate.mock.calls[1][0]).toBe('/data'));
});