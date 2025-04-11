import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/image/logo.png';
import '../assets/css/Header.css';
import { useAuth } from '../stores/context/AuthContext';
import useAuthService from '../services/authService';

const Header = ({ setShowLoginForm }) => {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const userInfoRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const { username, isAuthenticated } = useAuth();

    const { logout } = useAuthService();

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            userInfoRef.current &&
            !userInfoRef.current.contains(event.target)
        ) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setShowDropdown(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div className="header-wrapper">
            <header className="header">
                <div className="logo">
                    <img src={logoImage} alt="30Shine Logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }} />
                </div>
                <nav>
                    <ul>
                        <li><a href="/">Trang Chủ</a></li>
                        <li><a href="/about">Về 30Shine</a></li>
                        <li><a href="/shop">30Shine Shop</a></li>
                        <li><a href="/locations">Tìm 30Shine gần nhất</a></li>
                        <li><a href="/franchise">Nhượng quyền</a></li>
                        <li><a href="/partners">Đối tác</a></li>
                        <li><a href="/dv-smiles">Nụ cười DV</a></li>
                    </ul>
                </nav>
                {isAuthenticated ? (
                    <div className="user-info" onClick={toggleDropdown} ref={userInfoRef}>
                        <div className="user-dropdown-trigger">
                            <span>Xin chào, {username}</span>
                            <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`} >▼</span>
                        </div>
                    </div>
                ) : (
                    <button className="login-btn" onClick={() => setShowLoginForm(true)}>Đăng nhập</button>
                )}
            </header>

            {/* Dropdown menu được đặt bên ngoài header */}
            {isAuthenticated && (
                <div className={`dropdown-wrapper ${showDropdown ? 'open' : ''}`} ref={dropdownRef}>
                    <div className="dropdown-menu">
                        <a href="/profile">Thông tin cá nhân</a>
                        <a href="/booking-history">Lịch sử đặt lịch</a>
                        <button onClick={handleLogout}>Đăng xuất</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;