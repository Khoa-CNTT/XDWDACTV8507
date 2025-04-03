import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../assets/css/BarberSlider.css"; // Import your CSS file for styling
import barber1 from "../assets/image/barber1.jpg";
import barber2 from "../assets/image/barber2.jpg";
import barber3 from "../assets/image/barber3.jpg";
import barber4 from "../assets/image/barber3.jpg";

const barbers = [
    { name: "Dương Văn Mạnh", location: "345 Nguyễn Văn Linh, Đà Nẵng", image: barber1 },
    { name: "Đỗ Duy Thành", location: "172 Quang Trung, Đà Nẵng", image: barber2 },
    { name: "Nguyễn Văn Thuận", location: "328 Bạch Đằng, Hà Nội", image: barber3 },
    { name: "Nguyễn Trần", location: "290 Quang Trung, Thanh Hóa", image: barber4 },
];


const BarberSlider = () => {
    return (
        <div className="barber-slider">

            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={3}
                navigation
                breakpoints={{
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
            >
                {barbers.map((barber, index) => (
                    <SwiperSlide key={index} className="barber-card">
                        <img src={barber.image} alt={barber.name} className="barber-image" />
                        <h3>{barber.name}</h3>
                        <p>{barber.location}</p>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default BarberSlider;
