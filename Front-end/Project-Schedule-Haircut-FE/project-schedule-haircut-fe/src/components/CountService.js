import React, { useEffect } from 'react';
import '../assets/css/CountService.css';
import useCartService from '../services/cartService';

const CountService = ({ count }) => {
    const { fetchItemCount, itemCount, countStatus } = useCartService();

    useEffect(() => {
        fetchItemCount();
    }, []);

    return (
        <div className="barber-badge">
            <span>{itemCount}</span>
        </div>
    );
};

export default CountService;
