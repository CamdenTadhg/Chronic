import {createAction} from '@reduxjs/toolkit';

export const logoutAction = createAction('logout');

export function logout() {
    return {type: 'logout'}
};