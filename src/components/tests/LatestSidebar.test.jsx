import React from 'react';
import {render, waitFor, fireEvent} from '@testing-library/react';
import {it, expect, vi, afterEach} from 'vitest';
import '@testing-library/jest-dom';
import {MemoryRouter, BrowserRouter} from 'react-router-dom';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import LatestSidebar from '../LatestSidebar';
import rootReducer from '../../redux/reducers/rootReducer';
import ChronicAPI from '../../api/chronicAPI';

afterEach(() => {
    vi.resetAllMocks();
})

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
                <MemoryRouter>
                    <LatestSidebar/>
                </MemoryRouter>
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
        {PMID: 2345, title: 'a test article', abstract: 'this is a test article'},
        {PMID: 5732, title: 'a second test article', abstract: 'this is also a test article'}
    ]);
    const latestSidebar = render(
        <Provider store={store}>
            <MemoryRouter>
                <LatestSidebar/>
            </MemoryRouter>
        </Provider>
    );
    await waitFor(() => expect(latestSidebar).toMatchSnapshot());
});

it('displays the appropriate content', async () => {
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
            <MemoryRouter>
                <LatestSidebar/>
            </MemoryRouter>
        </Provider>
    );
    await waitFor(() => expect(getByText('The Latest')).toBeInTheDocument());
});

it('pulls general articles if no user is logged in', async () => {
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
            <MemoryRouter>
                <LatestSidebar/>
            </MemoryRouter>
        </Provider>
    );
    await waitFor(() => {
        expect(ChronicAPI.getArticleIds).toHaveBeenCalledOnce();
        expect(ChronicAPI.getArticleIds).toHaveBeenCalledWith(['chronic illness']);
        expect(ChronicAPI.getArticles).toHaveBeenCalledOnce();
        expect(ChronicAPI.getArticles).toHaveBeenCalledWith([1234,2233]);
        expect(getByText('a test article')).toBeInTheDocument()
    });
});

it('pulls specific articles if a user is logged in', async () => {
    const store = configureStore({reducer: rootReducer, preloadedState: {
        profile: {
            userId: 3,
            email: 'test@test.com', 
            name: 'Test User',
            isAdmin: false,
            lastLogin: '2024-11-01Z10:00:00.000Z',
            diagnoses: [
                {diagnosis: 'myalgic encephalitis', keywords: ['CFS', 'chronic fatigue syndrome']}
            ],
            symptoms: [],
            medications: [],
            loading: false,
            error: null,
            history: {}
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
                <LatestSidebar/>
            </MemoryRouter>
        </Provider>
    );
    await waitFor(() => {
        expect(ChronicAPI.getArticleIds).toHaveBeenCalledOnce();
        expect(ChronicAPI.getArticleIds).toHaveBeenCalledWith(['myalgic encephalitis', 'CFS', 'chronic fatigue syndrome']);
        expect(ChronicAPI.getArticles).toHaveBeenCalledOnce();
        expect(ChronicAPI.getArticles).toHaveBeenCalledWith([1234,2233]);
        expect(getByText('a test ME article')).toBeInTheDocument();
    });
});

it('displays an appropriate message if no articles are found', async () => {
    const store = configureStore({reducer:rootReducer, preloadedState: {
        latest: {
            articleIds: [],
            loading: true,
            error: null
        }
    }});
    ChronicAPI.getArticleIds = vi.fn();
    ChronicAPI.getArticleIds.mockResolvedValue([]);
    ChronicAPI.getArticles = vi.fn();
    const {getByText} = render(
        <Provider store={store}>
            <MemoryRouter>
                <LatestSidebar/>
            </MemoryRouter>
        </Provider>
    );
    await waitFor(() => {
        expect(ChronicAPI.getArticleIds).toHaveBeenCalledOnce();
        expect(ChronicAPI.getArticles).not.toHaveBeenCalledOnce();
        expect(getByText('No articles found')).toBeInTheDocument()
    });
});

it('opens article links in a new tab',async () => {
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
            <MemoryRouter>
                <LatestSidebar/>
            </MemoryRouter>
        </Provider>
    );
    await waitFor(() => {
        fireEvent.click(getByText('a test article'));
        expect(getByText('The Latest')).toBeInTheDocument();
    });
});

it('navigates to the latest page on link click', async () => {
    const store = configureStore({reducer: rootReducer});
    const {getByText} = render(
        <Provider store={store}>
            <BrowserRouter>
                <LatestSidebar/>
            </BrowserRouter>
        </Provider>
    );
    fireEvent.click(getByText('The Latest'));
    await waitFor(() => expect(window.location.pathname).toBe('/latest'));
});