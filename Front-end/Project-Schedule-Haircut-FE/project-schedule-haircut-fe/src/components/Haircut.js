import React from "react";

const Haircut = ({ services, loading, error }) => {
    return (
        <section className="services">
            <div className="title-wrapper">
                <h2>DỊCH VỤ TÓC</h2>
            </div>
            <div className="service-list">
                {services.map((service) => (
                    <div className="service-item" key={service.id}>
                        <a href={service.link}>
                            <img src={service.image} alt={service.name} />
                        </a>
                        <h3>{service.name}</h3>
                        <a href={service.link}>Tìm hiểu thêm →</a>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Haircut;