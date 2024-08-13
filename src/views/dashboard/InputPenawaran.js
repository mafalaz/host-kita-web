import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  CInputGroup, 
  CInputGroupText, 
  CFormInput, 
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
  CModalFooter,
  CFormTextarea
} from '@coreui/react';

const InputPenawaran = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [sisaStokProduk, setSisaStokProduk] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [statusPenawaran, setStatusPenawaran] = useState('Diajukan');
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
            } else {
                throw new Error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setErrorMessage('Gagal mengambil data pesanan. Silakan coba lagi nanti.');
            setShowErrorModal(true);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleOrderChange = (e) => {
        const orderId = parseInt(e.target.value, 10);
        setSelectedOrderId(orderId);
        const order = orders.find(order => order.orderId === orderId);
        setSelectedOrder(order || null);
    };

    const validateForm = () => {
        if (!selectedOrderId || !sisaStokProduk || !keterangan) {
            setErrorMessage('Semua form wajib diisi!');
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
                sisaStokProduk: sisaStokProduk.replace(/\./g, ''), // Hapus format sebelum mengirim ke server
                keterangan: keterangan,
                statusPenawaran: statusPenawaran,
            };

            const response = await axios.post('http://localhost:5000/api/admin/penawaran', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status) {
                setShowSuccessModal(true); 
                resetForm();
            } else {
                setErrorMessage('Gagal menambahkan penawaran. Silakan coba lagi.');
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error('Error submitting penawaran:', error);
            setErrorMessage('Terjadi kesalahan saat menambahkan penawaran. Silakan coba lagi.');
            setShowErrorModal(true);
        }
    };

    const resetForm = () => {
        setSelectedOrderId(null);
        setSelectedOrder(null);
        setSisaStokProduk('');
        setKeterangan('');
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
        setSisaStokProduk(formattedValue);
    };

    return (
        <CRow>
            <CCol xs>
                <CCard className="mb-4">
                    <CCardHeader>Input Penawaran</CCardHeader>
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
                                    <CInputGroupText>Sisa Stok Produk</CInputGroupText>
                                    <CFormInput 
                                        value={sisaStokProduk} 
                                        onChange={handleInputChange}
                                        inputMode="numeric"
                                        pattern="[0-9]*" 
                                        aria-label="Amount (to the nearest dollar)"
                                    />
                                </CInputGroup>

                                <CInputGroup className="mb-3">
                                    <CInputGroupText>Keterangan</CInputGroupText>
                                    <CFormTextarea 
                                        value={keterangan} 
                                        onChange={(e) => setKeterangan(e.target.value)} 
                                        rows={5}
                                    />
                                </CInputGroup>

                                <CInputGroup className="mb-3">
                                    <CInputGroupText>Status Penawaran</CInputGroupText>
                                    <CFormInput 
                                        value={statusPenawaran} 
                                        
                                        readOnly
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
                    Penawaran berhasil ditambahkan!
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

export default InputPenawaran;
