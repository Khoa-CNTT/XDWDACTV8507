// components/layouts/MainLayout.js
import React from 'react';
import FloatingWidgets from '../components/FloatingWidgets';

const MainLayout = ({ children }) => {
    return (
        <>
            {children}
            <FloatingWidgets />
        </>
    );
};

export default MainLayout;
