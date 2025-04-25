import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useCartService from '../services/cartService';
import '../assets/css/Cart.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { items, loading, error } = useSelector(state => state.cart);
    const { fetchCartItems, updateItemQuantity, deleteItem } = useCartService();
    const [selectedItems, setSelectedItems] = useState({});
    const [localLoading, setLocalLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadCartItems = async () => {
            setLocalLoading(true);
            try {
                await fetchCartItems();
            } finally {
                setLocalLoading(false);
            }
        };
        loadCartItems();
    }, []);
    console.log(items);

    useEffect(() => {
        if (items.length > 0) {
            const initialSelected = {};
            items.forEach(item => {
                initialSelected[item.id] = true;
            });
            setSelectedItems(initialSelected);
        }
    }, [items]);

    const handleCheckboxChange = (id) => {
        const itemToSelect = items.find(item => item.id === id);

        // Kiểm tra nếu item có "combo" trong tên và đang được chọn
        if (itemToSelect.name.toLowerCase().includes('combo') && !selectedItems[id]) {
            // Kiểm tra xem đã có combo nào được chọn chưa
            const hasSelectedCombo = items.some(item =>
                item.name.toLowerCase().includes('combo') && item.id !== id && selectedItems[item.id]
            );

            if (hasSelectedCombo) {
                setErrorMessage("Bạn chỉ có thể chọn một combo tại một thời điểm");
                return;
            }
        }

        setErrorMessage('');
        setSelectedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleSelectAllChange = () => {
        // Đếm số lượng combo trong giỏ hàng dựa trên tên
        const comboCount = items.filter(item => item.name.toLowerCase().includes('combo')).length;

        if (comboCount > 1) {
            setErrorMessage("Bạn chỉ có thể chọn một combo tại một thời điểm");
            return;
        }

        setErrorMessage('');
        const allSelected = Object.values(selectedItems).every(val => val);
        const newSelected = {};
        items.forEach(item => {
            newSelected[item.id] = !allSelected;
        });
        setSelectedItems(newSelected);
    };

    const handleRemoveService = async (id) => {
        try {
            setLocalLoading(true);
            await deleteItem(id);
            setSelectedItems(prev => {
                const newSelected = { ...prev };
                delete newSelected[id];
                return newSelected;
            });
            setErrorMessage('');
        } catch (error) {
            console.error("Xóa dịch vụ thất bại:", error);
        } finally {
            setLocalLoading(false);
        }
    };

    const calculateSelectedTotal = () => {
        return items
            .filter(item => selectedItems[item.id])
            .reduce((sum, item) => sum + item.price, 0);
    };

    const countSelectedItems = () => {
        return items.filter(item => selectedItems[item.id]).length;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleCheckout = () => {
        const selectedServices = items.filter(item => selectedItems[item.id]);
        if (selectedServices.length === 0) {
            setErrorMessage("Vui lòng chọn ít nhất một dịch vụ");
            return;
        }

        // Kiểm tra xem có nhiều hơn 1 combo được chọn không dựa trên tên
        const selectedCombos = selectedServices.filter(item => item.name.toLowerCase().includes('combo'));
        if (selectedCombos.length > 1) {
            setErrorMessage("Bạn chỉ có thể chọn một combo tại một thời điểm");
            return;
        }

        navigate('/booking', { state: { services: selectedServices } });
    };

    if (loading || localLoading) {
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

    if (error) return <div className="error">{error}</div>;

    return (
        <>
            <Header />
            <main className="container__main">
                <div className="container">
                    {errorMessage && (
                        <div className="error-message">
                            {errorMessage}
                        </div>
                    )}
                    <table className="container__chart">
                        <thead>
                            <tr className="container__header">
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={items.length > 0 && Object.values(selectedItems).every(val => val)}
                                        onChange={handleSelectAllChange}
                                        disabled={items.length === 0}
                                    />
                                </th>
                                <th>Dịch Vụ</th>
                                <th>Đơn Giá</th>
                                <th>Thời gian</th>
                                <th>Số Tiền</th>
                                <th>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-cart">
                                        Giỏ hàng trống
                                    </td>
                                </tr>
                            ) : (
                                items.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems[item.id] || false}
                                                onChange={() => handleCheckboxChange(item.id)}
                                                disabled={item.isCombo &&
                                                    Object.keys(selectedItems).some(id =>
                                                        selectedItems[id] &&
                                                        items.find(i => i.id === id)?.isCombo &&
                                                        id !== item.id
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="header__service-img"
                                            />
                                            <div className="header__service1">
                                                {item.name}<br className="br1" />
                                                {item.description || 'Dịch vụ chăm sóc tóc'}
                                            </div>
                                        </td>
                                        <td>{formatCurrency(item.price)}</td>
                                        <td>{item.haircutTime} phút</td>
                                        <td>{selectedItems[item.id] ? formatCurrency(item.price) : '0₫'}</td>
                                        <td>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleRemoveService(item.id);
                                                }}
                                            >
                                                Xóa
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="header__voucher">
                        <label htmlFor="voucher">Mã Voucher:</label>
                        <input type="text" id="voucher" placeholder="Nhập mã để giảm giá" />
                    </div>
                    <div className="header__total">
                        Tổng cộng ({countSelectedItems()} dịch vụ):
                        <span id="total"> {formatCurrency(calculateSelectedTotal())}</span>
                        <button className="btn" onClick={handleCheckout}>ĐẶT LỊCH</button>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Cart;