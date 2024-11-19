import React from 'react';
import {render} from '@testing-library/react';
import {it, expect} from 'vitest';
import '@testing-library/jest-dom';
import {MemoryRouter} from 'react-router-dom';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import About from '../About';
import rootReducer from '../../redux/reducers/rootReducer';

it('renders without errors', () => {
    const store = configureStore({reducer: rootReducer});
    render (
        <Provider store={store}>
            <MemoryRouter>
                <About/>
            </MemoryRouter>
        </Provider>
    );
});

it('matches the snapshot', () => {
    const store = configureStore({reducer: rootReducer});
    const about = render (
        <Provider store={store}>
            <MemoryRouter>
                <About/>
            </MemoryRouter>
        </Provider>
    );
    expect(about).toMatchSnapshot();
});

it('displays the appropriate content', () => {
    const store = configureStore({reducer: rootReducer});
    const {getByText} = render (
        <Provider store={store}>
            <MemoryRouter>
                <About />
            </MemoryRouter>
        </Provider>
    );
    expect(getByText('ABOUT CHRONIC')).toBeInTheDocument();
})