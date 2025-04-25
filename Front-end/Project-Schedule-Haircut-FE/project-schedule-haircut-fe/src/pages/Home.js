import React, { useState, useEffect } from "react";
import "../assets/css/Home.css";
import Footer from "../components/Footer";
import BarberSlider from "../components/BarberSlider";
import Header from "../components/Header";
import bannerImage from "../assets/image/banner.jpg";
import shineBanner from "../assets/image/shine_banner.jpg";
import shine1 from "../assets/image/shine1.jpg";
import shine2 from "../assets/image/shine2.jpg";
import shine3 from "../assets/image/shine3.jpg";
import ShineMemberBanner from "../assets/image/shine-member-banner.jpg";
import Haircut from '../components/Haircut';
import Spa from '../components/Spa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategories } from '../stores/slices/categorySlice';
import { fetchAllEmployees } from "../stores/slices/employeeSlice";
import AuthModal from "../components/AuthModal";
import useScrollAnimation from "../components/useScrollAnimation";

const Home = () => {
    const addToRefs = useScrollAnimation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector(state => state.categories);
    const [haircutServices, setHaircutServices] = useState([]);
    const [spaServices, setSpaServices] = useState([]);
    const { employees } = useSelector(state => state.employees);

    useEffect(() => {
        dispatch(fetchAllCategories());
    }, [dispatch]);

    useEffect(() => {
        if (categories.length > 0) {
            setHaircutServices(categories.filter(cat => cat.type === "HAIRCUT"));
            setSpaServices(categories.filter(cat => cat.type === "SPA"));
        }
    }, [categories]);

    useEffect(() => {
        dispatch(fetchAllEmployees());
    }, [dispatch]);

    const handleBooking = () => {
        console.log('Số điện thoại:', phoneNumber);
    };


    return (
        <div>
            {/* Header */}
            <Header />

            {/* Banner */}
            <section className="banner" ref={addToRefs}>
                <img src={bannerImage} alt="30 Shine Banner" />
            </section>

            {/* Đặt lịch */}
            <section className="booking" ref={addToRefs}>
                <div className="booking-box">
                    <h2>Đặt lịch giữ chỗ chỉ 30 giây</h2>
                    <p>Cắt xong trả tiền, hủy lịch không sao</p>
                    <div className="booking-form-home">
                        <input
                            type="text"
                            placeholder="Nhập SĐT để đặt lịch"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <button onClick={handleBooking}>ĐẶT LỊCH NGAY</button>
                    </div>
                </div>
                <div className="rating-box" ref={addToRefs}>
                    <a href="/rating">
                        <h3>Mời anh, chị đánh giá chất lượng dịch vụ</h3>
                        <p>Phản hồi của anh sẽ giúp chúng em cải thiện chất lượng dịch vụ tốt hơn</p>
                        <div className="stars">⭐⭐⭐⭐☆</div>
                    </a>
                </div>
            </section>

            {/* Dịch vụ tóc và Spa */}
            <div ref={addToRefs}>
                <Haircut services={haircutServices} loading={loading} error={error} />
            </div>
            <div ref={addToRefs}>
                <Spa services={spaServices} loading={loading} error={error} />
            </div>

            {/* SHINE COLLECTION */}
            <section className="shine-collection" ref={addToRefs}>
                <div className="title-wrapper"><h2>SHINE COLLECTION - VIBE NÀO CŨNG TỎA SÁNG</h2></div>
                <div className="shine-list">
                    <div className="shine-item shine-main-banner" ref={addToRefs}>
                        <a href="/shine-collection/aw-25-26">
                            <img src={shineBanner} alt="Men Hairstyle AW 25-26" />
                        </a>
                    </div>
                    <div className="shine-item" ref={addToRefs}>
                        <a href="/shine-collection/ready-for-new-game">
                            <img src={shine1} alt="Ready for new game" />
                        </a>
                    </div>
                    <div className="shine-item" ref={addToRefs}>
                        <a href="/shine-collection/anh-trai-say-hair">
                            <img src={shine2} alt="Anh trai say hair" />
                        </a>
                    </div>
                    <div className="shine-item" ref={addToRefs}>
                        <a href="/shine-collection/bad-boy">
                            <img src={shine3} alt="Bad Boy" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Top Thợ Cắt Tóc */}
            <section className="top-barbers" ref={addToRefs}>
                <div className="top-barbers-header">
                    <div className="title-wrapper"><h2>CÁC THỢ CẮT TÓC TRONG QUÁN</h2></div>
                    <p>Đội ngũ Stylist dày dặn kinh nghiệm</p>
                </div>
                <BarberSlider barbers={employees} />
            </section>

            {/* Shine Member */}
            <section className="shine-member" ref={addToRefs}>
                <div className="title-wrapper"><h2 className="shine-title">SHINE MEMBER</h2></div>
                <p className="shine-description">
                    Khi tham gia chương trình thành viên, anh được hưởng những ưu đãi đặc biệt và nhiều quyền lợi vượt trội trong quá trình sử dụng dịch vụ.
                </p>
                <div className="shine-banner" ref={addToRefs}>
                    <a href="/shine-member">
                        <img src={ShineMemberBanner} alt="Shine Member Banner" />
                    </a>
                </div>
            </section>

            {/* Footer */}
            <Footer />

            {/* Auth Modal */}
            <AuthModal />

        </div>

    );
};

export default Home;