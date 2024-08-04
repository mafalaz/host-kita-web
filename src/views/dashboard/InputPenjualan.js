import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  CInputGroup, 
  CInputGroupText, 
  CFormInput, 
  CFormLabel, 
  CButton, 
  CRow, 
  CCol, 
  CCard, 
  CCardHeader, 
  CCardBody, 
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react';

const InputPenjualan = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [sisaProduk, setSisaProduk] = useState('');
    const [totalCheckout, setTotalCheckout] = useState('');
    const [totalPendapatan, setTotalPendapatan] = useState('');
    const [tanggalUpdatePenjualan, setTanggalUpdatePenjualan] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/user/allOrder', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.status) {
                setOrders(response.data.orderUser);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleOrderChange = (e) => {
        const orderId = parseInt(e.target.value, 10);
        setSelectedOrderId(orderId);
        const order = orders.find(order => order.orderId === orderId);
        setSelectedOrder(order);
    };

    const validateForm = () => {
        if (!sisaProduk || !totalCheckout || !totalPendapatan || !tanggalUpdatePenjualan) {
            setErrorMessage('Semua form wajib diisi !');
            setShowErrorModal(true);
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            const data = {
                userId: selectedOrder.userId,
                orderId: selectedOrder.orderId,
                nama_umkm: selectedOrder.nama_umkm,
                email: selectedOrder.email,
                namaProduk: selectedOrder.namaProduk,
                hargaProduk: selectedOrder.hargaProduk,
                jumlahProduk: selectedOrder.jumlahProduk,
                sisaProduk: sisaProduk,
                totalCheckout: totalCheckout,
                totalPendapatan: totalPendapatan.replace(/\./g, ''), // Menghapus titik sebelum mengirim
                tanggalUpdatePenjualan: tanggalUpdatePenjualan
            };

            const response = await axios.post('http://localhost:5000/api/admin/penjualan', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status) {
                setShowSuccessModal(true); // Menampilkan modal ketika berhasil
                resetForm();
            } else {
                alert('Gagal menambahkan penjualan');
            }
        } catch (error) {
            console.error('Error submitting penjualan:', error);
            alert('Terjadi kesalahan saat menambahkan penjualan');
        }
    };

    const resetForm = () => {
        setSelectedOrderId(null);
        setSelectedOrder(null);
        setSisaProduk('');
        setTotalCheckout('');
        setTotalPendapatan('');
        setTanggalUpdatePenjualan('');
        setErrorMessage('');
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    const handleInputChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Hanya angka
        const formattedValue = new Intl.NumberFormat('id-ID').format(value); // Format ke id-ID
        setTotalPendapatan(formattedValue);
    };

    return (
        <CRow>
            <CCol xs>
                <CCard className="mb-4">
                    <CCardHeader>Input Penjualan</CCardHeader>
                    <CCardBody>
                        <CInputGroup className="mb-3">
                            <CInputGroupText as="label" htmlFor="orderSelect">Order Id</CInputGroupText>
                            <CFormSelect id="orderSelect" onChange={handleOrderChange} value={selectedOrderId || ''}>
                                <option value="">Pilih...</option>
                                {orders.map(order => (
                                    <option key={order.orderId} value={order.orderId}>{order.orderId}</option>
                                ))}
                            </CFormSelect>
                        </CInputGroup>

                        {selectedOrder && (
                            <>
                                <CInputGroup className="mb-3">
                                    <CInputGroupText>Nama UMKM</CInputGroupText>
                                    <CFormInput value={selectedOrder.nama_umkm} readOnly />
                                </CInputGroup>

                                <CInputGroup className="mb-3">
                                    <CInputGroupText>Email</CInputGroupText>
                                    <CFormInput value={selectedOrder.email} readOnly />
                                </CInputGroup>

                                <CInputGroup className="mb-3">
                                    <CInputGroupText>Nama Produk</CInputGroupText>
                                    <CFormInput value={selectedOrder.namaProduk} readOnly />
                                </CInputGroup>

                                <CInputGroup className="mb-3">
                                    <CInputGroupText>Harga Produk</CInputGroupText>
                                    <CFormInput value={selectedOrder.hargaProduk} readOnly />
                                </CInputGroup>

                                <CInputGroup className="mb-3">
                                    <CInputGroupText>Jumlah Produk</CInputGroupText>
                                    <CFormInput value={selectedOrder.jumlahProduk} readOnly />
                                </CInputGroup>

                                <CInputGroup className="mb-3">
                                    <CInputGroupText>Sisa Produk</CInputGroupText>
                                    <CFormInput 
                                        value={sisaProduk} 
                                        onChange={(e) => setSisaProduk(e.target.value)} 
                                    />
                                </CInputGroup>

                                <CInputGroup className="mb-3">
                                    <CInputGroupText>Total Checkout</CInputGroupText>
                                    <CFormInput 
                                        value={totalCheckout} 
                                        onChange={(e) => setTotalCheckout(e.target.value)} 
                                    />
                                </CInputGroup>

                                <CFormLabel htmlFor="total-payment">Total Pendapatan</CFormLabel>
                                <CInputGroup className="mb-3">
                                    <CInputGroupText>Rp</CInputGroupText>
                                    <CFormInput
                                        id="total-payment"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        aria-label="Amount (to the nearest dollar)"
                                        value={totalPendapatan}
                                        onChange={handleInputChange}
                                    />
                                </CInputGroup>

                                <CFormLabel htmlFor="payment-date">Tanggal Update Penjualan</CFormLabel>
                                <CInputGroup className="mb-3">
                                    <CFormInput 
                                        type="date" 
                                        id="payment-date" 
                                        value={tanggalUpdatePenjualan} 
                                        onChange={(e) => setTanggalUpdatePenjualan(e.target.value)}
                                    />
                                </CInputGroup>

                                <div className="d-grid gap-2">
                                    <CButton color="primary" onClick={handleSubmit}>Submit</CButton>
                                </div>
                            </>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>

            <CModal visible={showSuccessModal} onClose={handleCloseSuccessModal}>
                <CModalHeader>
                    <CModalTitle>Success</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Penjualan berhasil ditambahkan!
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCloseSuccessModal}>Close</CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={showErrorModal} onClose={handleCloseErrorModal}>
                <CModalHeader>
                    <CModalTitle>Error</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {errorMessage}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCloseErrorModal}>Close</CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    );
};

export default InputPenjualan;
