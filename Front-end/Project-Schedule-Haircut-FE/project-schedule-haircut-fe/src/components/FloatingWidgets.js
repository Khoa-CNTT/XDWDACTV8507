import React from 'react';
import '../assets/css/FloatingWidgets.css';
import botImg from '../assets/image/bot.jpg';
import barberImg from '../assets/image/barber.png';
import { FaArrowUp } from 'react-icons/fa';
import CountService from './CountService';
import { useNavigate } from 'react-router-dom';

const FloatingWidgets = () => {
    const scrollToTop = () => {
        const scrollStep = -window.scrollY / 35;
        const smoothScroll = () => {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
                requestAnimationFrame(smoothScroll);
            }
        };
        requestAnimationFrame(smoothScroll);
    };

    const navigate = useNavigate();

    const handleBarberClick = () => {
        navigate('/cart');
    };

    return (
        <div className="floating-widgets">
            <div className="circle-btn arrow" onClick={scrollToTop}>
                <FaArrowUp color="white" size={20} />
            </div>
            <div className="circle-btn">
                <img src={botImg} alt="Bot" />
            </div>
            <div
                className="circle-btn outline"
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={handleBarberClick}
            >
                <img src={barberImg} alt="Barber" />
                <CountService count={5} />
            </div>
        </div>
    );
};

export default FloatingWidgets;
