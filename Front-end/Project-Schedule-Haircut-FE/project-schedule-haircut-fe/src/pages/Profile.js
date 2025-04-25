import React, { useEffect, useState } from 'react';
import '../assets/css/Profile.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cookies from 'js-cookie'; // import js-cookie
import useProfileService from '../services/profileService'; // import useProfileService
import { ClipLoader } from 'react-spinners';
const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { getProfile } = useProfileService();
    useEffect(() => {
        const fetchData = async () => {
            const username = Cookies.get('username');
            try {
                const data = await getProfile(username);
                setProfile(data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <>
                <Header />
                <main style={{ display: 'flex', justifyContent: 'center', marginTop: 260, marginBottom: 260 }}>
                    <ClipLoader color="#3498db" size={50} />
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main>
                <div className="profile">
                    <h2>Hồ Sơ Của Tôi</h2>
                    {/* <p className="description">Quản lý thông tin hồ sơ để bảo mật tài khoản</p> */}
                    <div className="content">
                        <form className="profile__form-panel">
                            <div className="profile__form-group">
                                <label>Tên đăng nhập</label>
                                <span>{profile.userName}</span>
                            </div>

                            <div className="profile__form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={profile.email || ''}
                                    placeholder="Hãy nhập email của bạn"
                                    readOnly
                                />
                            </div>

                            <div className="profile__form-group">
                                <label>Số điện thoại</label>
                                <input
                                    type="text"
                                    value={profile.phone || ''}
                                    placeholder="Hãy nhập số điện thoại của bạn"
                                    readOnly
                                />
                            </div>

                            <div className="profile__form-group">
                                <label>Địa chỉ</label>
                                <input
                                    type="text"
                                    value={profile.address || ''}
                                    placeholder="Hãy nhập địa chỉ của bạn"
                                    readOnly
                                />
                            </div>

                            <button type="submit" className="save-btn">Lưu</button>
                        </form>

                        <div className="profile__form-avatar">
                            <div className="avatar">
                                <img
                                    src={profile.avatar || "https://via.placeholder.com/150"}
                                    alt="Ảnh người dùng"
                                />
                            </div>
                            <button className="profile__form-avatar-upload-btn">Chọn ảnh</button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Profile;
