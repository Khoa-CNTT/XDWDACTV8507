import React from 'react';
import '../assets/css/CountService.css';

const CountService = ({ count }) => {
    return (
        <div className="barber-badge">
            <span>{count}</span>
        </div>
    );
};

export default CountService;
