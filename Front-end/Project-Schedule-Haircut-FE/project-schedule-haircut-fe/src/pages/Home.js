import React, { useState, useEffect, useRef } from "react";
import "../assets/css/Home.css";
import Footer from "../components/Footer";
import BarberSlider from "../components/BarberSlider";
import bannerImage from "../assets/image/banner.jpg";
import logoImage from "../assets/image/logo.png";
import haircutImage from "../assets/image/haircut.jpg";
import hairColorImage from "../assets/image/haircolor.jpg";
import hairCurlImage from "../assets/image/haircurl.jpg";
import spa1 from "../assets/image/spa1.jpg";
import spa2 from "../assets/image/spa2.png";
import shineBanner from "../assets/image/shine_banner.jpg";
import shine1 from "../assets/image/shine1.jpg";
import shine2 from "../assets/image/shine2.jpg";
import shine3 from "../assets/image/shine3.jpg";
import ShineMemberBanner from "../assets/image/shine-member-banner.jpg";
import LoginForm from './Login';
import useAuthService from '../services/authService';

const Home = () => {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { logout } = useAuthService();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // useEffect(() => {
    //     const savedUsername = Cookies.get('username');
    //     if (savedUsername) {
    //         setUsername(savedUsername);
    //     }
    // }, []);

    const handleLoginClick = () => {
        setShowLoginForm(true);
    };

    const handleCloseLoginForm = () => {
        setShowLoginForm(false);
    };

    const handleLogout = async () => {
        try {
            await logout();

            setUsername('');
            setShowDropdown(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleBooking = () => {
        console.log('Số điện thoại:', phoneNumber);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    useEffect(() => {
        document.body.style.overflow = showLoginForm ? 'hidden' : 'unset'; // Cập nhật overflow của body
    }, [showLoginForm]);

    return (
        <div>
            {/* Header */}
            <header className="header">
                <div className="logo">
                    <img src={logoImage} alt="30Shine Logo" />
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
                {username ? (
                    <div className="user-info" ref={dropdownRef}>
                        <div className="user-dropdown-trigger" onClick={toggleDropdown}>
                            <span>Xin chào, {username}</span>
                            <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▼</span>
                        </div>
                        <div className={`dropdown-menu ${showDropdown ? 'open' : ''}`}>
                            <a href="/profile">Thông tin cá nhân</a>
                            <a href="/booking-history">Lịch sử đặt lịch</a>
                            <button onClick={handleLogout}>Đăng xuất</button>
                        </div>
                    </div>
                ) : (
                    <button className="login-btn" onClick={handleLoginClick}>Đăng nhập</button>
                )}
            </header>
            {showLoginForm && (
                <div className="overlay">
                    <LoginForm onClose={handleCloseLoginForm} setUsername={setUsername}>
                        <button className="close-button" onClick={handleCloseLoginForm}>
                            ×
                        </button>
                    </LoginForm>
                </div>
            )}
            {/* Banner */}
            <section className="banner">
                <img src={bannerImage} alt="30 Shine Banner" />
            </section>
            {/* Đặt lịch */}
            <section className="booking">
                <div className="booking-box">
                    <h2>Đặt lịch giữ chỗ chỉ 30 giây</h2>
                    <p>Cắt xong trả tiền, hủy lịch không sao</p>
                    <div className="booking-form">
                        <input
                            type="text"
                            placeholder="Nhập SĐT để đặt lịch"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <button onClick={handleBooking}>ĐẶT LỊCH NGAY</button>
                    </div>
                </div>
                <div className="rating-box">
                    <a href="/rating">
                        <h3>Mời anh, chị đánh giá chất lượng dịch vụ</h3>
                        <p>Phản hồi của anh sẽ giúp chúng em cải thiện chất lượng dịch vụ tốt hơn</p>
                        <div className="stars">⭐⭐⭐⭐☆</div>
                    </a>
                </div>
            </section>
            {/* Dịch vụ tóc */}
            <section className="services">
                <div className="title-wrapper"><h2>DỊCH VỤ TÓC</h2></div>
                <div className="service-list">
                    <div className="service-item">
                        <a href="/haircut">
                            <img src={haircutImage} alt="Cắt tóc" />
                        </a>
                        <h3>Cắt tóc</h3>
                        <p>Giá từ 50.000đ</p>
                        <a href="/haircut">Tìm hiểu thêm →</a>
                    </div>
                    <div className="service-item">
                        <a href="/haircolor">
                            <img src={hairColorImage} alt="Thay đổi màu tóc" />
                        </a>
                        <h3>Thay đổi màu tóc</h3>
                        <p>Giá từ 200.000đ</p>
                        <a href="/haircolor">Tìm hiểu thêm →</a>
                    </div>
                    <div className="service-item">
                        <a href="/haircurl">
                            <img src={hairCurlImage} alt="Uốn tóc định hình" />
                        </a>
                        <h3>Uốn tóc định hình</h3>
                        <p>Giá từ 350.000đ</p>
                        <a href="/haircurl">Tìm hiểu thêm →</a>
                    </div>
                </div>
            </section>
            {/* SPA & RELAX */}
            <section className="spa-relax">
                <div className="title-wrapper"><h2>SPA & RELAX</h2></div>
                <div className="spa-list">
                    <div className="spa-item">
                        <a href="/spa-massage">
                            <img src={spa1} alt="Gội Massage Relax" />
                        </a>
                        <h3>Gội Massage Relax</h3>
                        <p>Chọn Combo ...</p>
                        <a href="/spa-massage">Tìm hiểu thêm →</a>
                    </div>
                    <div className="spa-item">
                        <a href="/ear-cleaning">
                            <img src={spa2} alt="Lấy ráy tai êm" />
                        </a>
                        <h3>Lấy ráy tai êm</h3>
                        <p>Giá từ 60.000đ</p>
                        <a href="/ear-cleaning">Tìm hiểu thêm →</a>
                    </div>
                </div>
            </section>
            {/* SHINE COLLECTION */}
            <section className="shine-collection">
                <div className="title-wrapper"><h2>SHINE COLLECTION - `VIBE` NÀO CŨNG TỎA SÁNG</h2></div>
                <div className="shine-list">
                    <div className="shine-item shine-banner">
                        <a href="/shine-collection/aw-25-26">
                            <img src={shineBanner} alt="Men Hairstyle AW 25-26" />
                        </a>
                    </div>
                    <div className="shine-item">
                        <a href="/shine-collection/ready-for-new-game">
                            <img src={shine1} alt="Ready for new game" />
                        </a>
                    </div>
                    <div className="shine-item">
                        <a href="/shine-collection/anh-trai-say-hair">
                            <img src={shine2} alt="Anh trai say hair" />
                        </a>
                    </div>
                    <div className="shine-item">
                        <a href="/shine-collection/bad-boy">
                            <img src={shine3} alt="Bad Boy" />
                        </a>
                    </div>
                </div>
            </section>
            {/* Top Thợ Cắt Tóc Trong Tháng */}
            <section className="top-barbers">
                <div className="top-barbers-header">
                    <div className="title-wrapper"><h2>TOP THỢ CẮT TÓC TRONG THÁNG</h2></div>
                    <p>Đội ngũ Stylist dày dặn kinh nghiệm</p>
                </div>
                <BarberSlider />
            </section>
            {/* Shine Member */}
            <section className="shine-member">
                <div className="title-wrapper"><h2 className="shine-title">SHINE MEMBER</h2></div>
                <p className="shine-description">
                    Khi tham gia chương trình thành viên, anh được hưởng những ưu đãi đặc biệt và nhiều quyền lợi vượt trội trong quá trình sử dụng dịch vụ.
                </p>
                <div className="shine-banner">
                    <a href="/shine-member">
                        <img src={ShineMemberBanner} alt="Shine Member Banner" />
                    </a>
                </div>
            </section>
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;