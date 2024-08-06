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

const PaymentToCustomer = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [totalPembayaran, setTotalPembayaran] = useState('');
  const [buktiPembayaran, setBuktiPembayaran] = useState(null); // Updated to null
  const [tanggalPembayaran, setTanggalPembayaran] = useState('');
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
    if (!totalPembayaran || !buktiPembayaran || !tanggalPembayaran) {
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
      const formData = new FormData();
      formData.append('userId', selectedOrder.userId);
      formData.append('orderId', selectedOrder.orderId);
      formData.append('nama_umkm', selectedOrder.nama_umkm);
      formData.append('email', selectedOrder.email);
      formData.append('namaProduk', selectedOrder.namaProduk);
      formData.append('totalPembayaran', totalPembayaran.replace(/\./g, '')); // Menghapus titik sebelum mengirim
      formData.append('tanggalPembayaran', tanggalPembayaran);
      formData.append('buktiPembayaran', buktiPembayaran);

      const response = await axios.post('http://localhost:5000/api/user/payment', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status) {
        setShowSuccessModal(true); // Menampilkan modal ketika berhasil
        resetForm();
      } else {
        alert('Gagal menambahkan Pembayaran');
      }
    } catch (error) {
      console.error('Error submitting Pembayaran:', error);
      alert('Terjadi kesalahan saat menambahkan Pembayaran');
    }
  };

  const resetForm = () => {
    setSelectedOrderId(null);
    setSelectedOrder(null);
    setTotalPembayaran('');
    setBuktiPembayaran(null);
    setTanggalPembayaran('');
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
    setTotalPembayaran(formattedValue);
  };

  const handleFileChange = (e) => {
    setBuktiPembayaran(e.target.files[0]);
  };

  return (
    <CRow>
      <CCol xs>
        <CCard className="mb-4">
          <CCardHeader>Input Pembayaran</CCardHeader>
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

                <CFormLabel htmlFor="total-payment">Total Pembayaran</CFormLabel>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Rp</CInputGroupText>
                  <CFormInput
                    id="total-payment"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    aria-label="Amount (to the nearest dollar)"
                    value={totalPembayaran}
                    onChange={handleInputChange}
                  />
                </CInputGroup>

                <div className="mb-3">
                  <CFormLabel htmlFor="formFile">Bukti Pembayaran</CFormLabel>
                  <CFormInput type="file" id="formFile" onChange={handleFileChange} />
                </div>

                <CFormLabel htmlFor="payment-date">Tanggal Pembayaran</CFormLabel>
                <CInputGroup className="mb-3">
                  <CFormInput
                    type="date"
                    id="payment-date"
                    value={tanggalPembayaran}
                    onChange={(e) => setTanggalPembayaran(e.target.value)}
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
          Pembayaran berhasil ditambahkan!
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

export default PaymentToCustomer;
