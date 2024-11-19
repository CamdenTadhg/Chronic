import {cleanup} from '@testing-library/react';
import { afterEach } from 'node:test';
import { vi } from 'vitest';

afterEach(() => {
    vi.unmock('react-router-dom');
    cleanup();
})