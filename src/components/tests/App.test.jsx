import React, { act } from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import {it, expect, vi} from 'vitest';
import '@testing-library/jest-dom';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import {MemoryRouter, Route, Routes, Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import App from '../../App';
import rootReducer from '../../redux/reducers/rootReducer';
import ChronicAPI from '../../api/chronicAPI';


it('renders without errors', async () => {
    const store = configureStore({reducer: rootReducer});
    ChronicAPI.getArticleIds = vi.fn();
    ChronicAPI.getArticleIds.mockResolvedValue([1234,2233]);
    ChronicAPI.getArticles = vi.fn();
    ChronicAPI.getArticles.mockResolvedValue([
        {PMID: 2345, title: 'a test article', abstract: "this is a test article"},
        {PMID: 5732, title: 'a second test article', abstract: "this is also a test article"}
    ]);
    await waitFor(() => {
        render(
            <Provider store={store}>
                <App/>
            </Provider>
        )
    });
});

it('matches the snapshot', async () => {
    const store = configureStore({reducer: rootReducer});
    ChronicAPI.getArticleIds = vi.fn();
    ChronicAPI.getArticleIds.mockResolvedValue([1234,2233]);
    ChronicAPI.getArticles = vi.fn();
    ChronicAPI.getArticles.mockResolvedValue([
        {PMID: 2345, title: 'a test article', abstract: "this is a test article"},
        {PMID: 5732, title: 'a second test article', abstract: "this is also a test article"}
    ]);
    const app = render(
        <Provider store={store}>
            <App/>
        </Provider>
    );
    await waitFor(() => expect(app).toMatchSnapshot());
});

it('allows a logged in user to navigate to protected routes', async () => {
    const store = configureStore({reducer: rootReducer, preloadedState: {
        profile: {
            userId: 7,
            diagnoses: [ {
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
            <App/>
        </Provider>
    );
    fireEvent.click(getByText('Tracking'));
    await waitFor(() => expect(getByText('Tracking page coming soon...')).toBeInTheDocument());
    ;
});

it('redirects an anonymous user from accessing protected routes', async () => {
    const store = configureStore({reducer: rootReducer});
    ChronicAPI.getArticleIds = vi.fn();
    ChronicAPI.getArticleIds.mockResolvedValue([1234,2233]);
    ChronicAPI.getArticles = vi.fn();
    ChronicAPI.getArticles.mockResolvedValue([
        {PMID: 2345, title: 'a test article', abstract: 'this is a test article'},
        {PMID: 5732, title: 'a second test article', abstract: 'this is also a test article'}
    ]);
    const {getByText} = render(
        <Provider store={store}>
            <App/>
        </Provider>
    );
    act(() => {
        window.history.pushState({}, 'Tracking', '/tracking');
    });
    await waitFor(() => expect(getByText('Your Health. Your Data. Your Power.')).toBeInTheDocument());
});