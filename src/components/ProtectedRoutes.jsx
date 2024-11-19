import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';

const ProtectedRoute = () => {
    const currentUser = useSelector((state) => state.profile.userId);

    return (
        currentUser ? 
            <Outlet/> : 
            <Navigate to='/'/> 
    )
}

export default ProtectedRoute;