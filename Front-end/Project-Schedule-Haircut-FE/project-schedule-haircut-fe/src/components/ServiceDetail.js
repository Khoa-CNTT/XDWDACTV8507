import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../assets/css/ServiceDetail.css";
import useCartService from "../services/cartService"; // Import cartService
import { toast } from "react-toastify";

const ServiceDetail = ({ title, subtitle, services, combos }) => {
    const { addCombo, addService } = useCartService(); // Sử dụng cartService

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    // Hàm thêm service vào giỏ hàng
    const handleAddService = async (serviceId) => {
        try {
            const request = { serviceId };
            const success = await addService(request);
            if (success) {
                toast.success("Đã thêm dịch vụ vào giỏ hàng");
            }
        } catch (error) {
            toast.error(error.message || "Lỗi khi thêm dịch vụ vào giỏ hàng");
        }
    };

    // Hàm thêm combo vào giỏ hàng
    const handleAddCombo = async (comboId) => {
        try {
            const request = { comboId };
            const success = await addCombo(request);
            if (success) {
                toast.success("Đã thêm combo vào giỏ hàng");
            }
        } catch (error) {
            toast.error(error.message || "Lỗi khi thêm combo vào giỏ hàng");
        }
    };

    return (
        <section className="service-detail">
            <h2 className="service-title">{title}</h2>
            <p className="service-subtitle">{subtitle}</p>

            <div className="service-section">
                <h3 className="section-title">Dịch vụ đơn lẻ</h3>
                <div className="service-list-main">
                    {services.map((service) => (
                        <div key={service.id} className="service-card">
                            <div className="service-image-container-main">
                                <img
                                    src={service.image || "/default-service.jpg"}
                                    alt={service.name}
                                    onError={(e) => {
                                        e.target.src = "/default-service.jpg";
                                    }}
                                />
                            </div>
                            <div className="service-info">
                                <h4>{service.name}</h4>
                                <div className="service-meta">
                                    <span className="price">{formatPrice(service.price)}</span>
                                    <span className="time">{service.haircutTime} phút</span>
                                </div>
                            </div>
                            <div className="service-footer">
                                <span className="time-badge">
                                    {service.haircutTime} phút
                                </span>
                                <button
                                    className="expand-btn"
                                    onClick={() => handleAddService(service.id)}
                                    aria-label={`Thêm ${service.name} vào giỏ hàng`}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="service-section">
                <h3 className="section-title">Combo dịch vụ</h3>
                <div className="combo-list">
                    {combos.map((combo) => (
                        <div key={combo.id} className="combo-card">
                            <div className="combo-image-container">
                                <img
                                    src={combo.image || "/default-combo.jpg"}
                                    alt={combo.name}
                                    onError={(e) => {
                                        e.target.src = "/default-combo.jpg";
                                    }}
                                />
                            </div>
                            <div className="combo-info">
                                <h3>{combo.name}</h3>
                                <div className="combo-meta">
                                    <span className="price">{formatPrice(combo.price)}</span>
                                    <span className="time">{combo.haircutTime} phút</span>
                                </div>
                            </div>
                            <div className="combo-footer">
                                <span className="time-badge">
                                    {combo.haircutTime} phút
                                </span>
                                <button
                                    className="expand-btn"
                                    onClick={() => handleAddCombo(combo.id)}
                                    aria-label={`Thêm ${combo.name} vào giỏ hàng`}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button className="booking-button">ĐẶT LỊCH NGAY</button>
        </section>
    );
};

export default ServiceDetail;