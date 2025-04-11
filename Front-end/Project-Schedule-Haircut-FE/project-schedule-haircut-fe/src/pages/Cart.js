import React from 'react';
import '../assets/css/Cart.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Cart = () => {
    return (
        <>
            <Header />
            <div className="container">
                <table className="container__chart">
                    <thead>
                        <tr className="container__header">
                            <th><input type="checkbox" /></th>
                            <th>Dịch Vụ</th>
                            <th>Đơn Giá</th>
                            <th>Thời gian</th>
                            <th>Số Tiền</th>
                            <th>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="checkbox" /></td>
                            <td>
                                <img
                                    src="https://storage.30shine.com/web/v4/images/cat-toc/cat-goi-combo-1-1.jpg"
                                    alt="" className="header__service-img" />
                                <div className="header__service1">
                                    Cắt gội Combo 1<br className="br1" />
                                    Combo cắt kỹ, gội massage thư giãn bằng đá nóng
                                </div>
                            </td>
                            <td>150.000đ</td>
                            <td>75 phút</td>
                            <td>150.000đ</td>
                            <td><a href="#">Xóa</a></td>
                        </tr>
                        <tr>
                            <td><input type="checkbox" /></td>
                            <td>
                                <img
                                    src="https://storage.30shine.com/web/v4/images/goi-massage-relax/lay-ray-tai-1-1.jpg"
                                    alt="" className="header__service-img" />
                                <div className="header__service1">
                                    Lấy ráy tai Combo 2<br className="br1" />
                                    Combo lấy ráy tai êm, thư giãn trong không gian yên tĩnh
                                </div>
                            </td>
                            <td>75.000đ</td>
                            <td>30 phút</td>
                            <td>75.000đ</td>
                            <td><a href="#">Xóa</a></td>
                        </tr>

                        <tr>
                            <td><input type="checkbox" /></td>
                            <td>
                                <img
                                    src="https://storage.30shine.com/web/v4/images/dich-vu-uon-nhuom-duong/nhuom-cao-cap-1.jpg"
                                    alt="" className="header__service-img" />
                                <div className="header__service1">
                                    Cắt gội Combo 4<br className="br1" />
                                    Combo cắt kỹ, thay đổi màu tóc & phục hồi tóc và bảo vệ tóc
                                </div>
                            </td>
                            <td>350.000đ</td>
                            <td>120 phút</td>
                            <td>350.000đ</td>
                            <td><a href="#">Xóa</a></td>
                        </tr>

                        <tr>
                            <td><input type="checkbox" /></td>
                            <td>
                                <img
                                    src="https://storage.30shine.com/web/v4/images/dich-vu-uon-nhuom-duong/duong-keratin-1.jpg?v=1"
                                    alt="" className="header__service-img" />
                                <div className="header__service1">
                                    Cắt gội Combo 3<br className="br1" />
                                    Combo cắt kỹ, dưỡng phục hồi tinh chất Oliu phục hồi tóc hư tổn, khô sơ
                                </div>
                            </td>
                            <td>400.000đ</td>
                            <td>100 phút</td>
                            <td>400.000đ</td>
                            <td><a href="#">Xóa</a></td>
                        </tr>
                    </tbody>
                </table>
                <div className="header__voucher">
                    <label htmlFor="voucher">Mã Voucher:</label>
                    <input type="text" id="voucher" placeholder="Nhập mã để giảm giá" />
                </div>
                <div className="header__total">Tổng cộng (4 dịch vụ): <span id="total">975.000đ</span>
                    <button className="btn">ĐẶT LỊCH</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Cart;