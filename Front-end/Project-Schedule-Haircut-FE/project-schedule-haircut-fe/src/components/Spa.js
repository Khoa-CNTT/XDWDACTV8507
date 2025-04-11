import React from "react";

const SpaServices = ({ services, loading, error }) => {
    return (
        <section className="spa-relax">
            <div className="title-wrapper">
                <h2>SPA & RELAX</h2>
            </div>
            <div className="spa-list">
                {services.map((service) => (
                    <div className="spa-item" key={service.id}>
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

export default SpaServices;