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

const InputJadwal = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [namaHostLive, setNamaHostLive] = useState('');
    const [tanggalLive, setTanggalLive] = useState('');
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
        if (!namaHostLive || !tanggalLive) {
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
                namaHostLive: namaHostLive,
                tanggalLive: tanggalLive,
            };

            const response = await axios.post('http://localhost:5000/api/admin/jadwal', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status) {
                setShowSuccessModal(true); // Menampilkan modal ketika berhasil
                resetForm();
            } else {
                alert('Gagal menambahkan Jadwal');
            }
        } catch (error) {
            console.error('Error submitting Jadwal:', error);
            alert('Terjadi kesalahan saat menambahkan Jadwal');
        }
    };

    const resetForm = () => {
        setSelectedOrderId(null);
        setSelectedOrder(null);
        setNamaHostLive('');
        setTanggalLive('');
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
                    <CCardHeader>Input Jadwal</CCardHeader>
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
                                    <CInputGroupText>Nama Host Live Streaming</CInputGroupText>
                                    <CFormInput 
                                        value={namaHostLive} 
                                        onChange={(e) => setNamaHostLive(e.target.value)} 
                                    />
                                </CInputGroup>


                                <CFormLabel htmlFor="payment-date">Tanggal Live</CFormLabel>
                                <CInputGroup className="mb-3">
                                    <CFormInput 
                                        type="date" 
                                        id="payment-date" 
                                        value={tanggalLive} 
                                        onChange={(e) => setTanggalLive(e.target.value)}
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
                    Jadwal Live berhasil ditambahkan!
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

export default InputJadwal;
