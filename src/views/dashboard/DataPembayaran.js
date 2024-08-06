import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAvatar, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople } from '@coreui/icons';

const DataPembayaran = () => {
  const [payments, setPayments] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [modal, setModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://192.168.1.3:5000/api/admin/getAllPayment', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.status) {
        setPayments(response.data.listPayment);
        setHasMore(false); // Karena kita mengambil semua data sekaligus
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    toggleModal();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  

  const formatCurrency = (value) => {
    return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
  };
  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Data Pembayaran</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Payment Id</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Order Id</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">UMKM</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Email</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Produk</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Total Pembayaran</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Bukti Pembayaran</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Tanggal Pembayaran</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {payments.map((payment, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="text-center">{payment.paymentCustomerId}</CTableDataCell>
                      <CTableDataCell className="text-center">{payment.orderId}</CTableDataCell>
                      <CTableDataCell className="text-center">{payment.nama_umkm}</CTableDataCell>
                      <CTableDataCell className="text-center">{payment.email}</CTableDataCell>
                      <CTableDataCell className="text-center">{payment.namaProduk}</CTableDataCell>
                      <CTableDataCell className="text-center">{formatCurrency(payment.totalPembayaran)}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <img
                          src={payment.buktiPembayaran}
                          alt="Bukti Pembayaran"
                          onClick={() => openModal(payment.buktiPembayaran)}
                          style={{
                            cursor: 'pointer',
                            width: '50px', // Ukuran kotak persegi
                            height: '50px', // Ukuran kotak persegi
                            objectFit: 'cover', // Crop gambar
                            borderRadius: '8px' // Membuat sudut kotak persegi
                          }}
                        />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{formatDate(payment.tanggalPembayaran)}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={modal} onClose={() => setModal(false)}>
        <CModalHeader onClose={() => setModal(false)}>
          <CModalTitle>Bukti Pembayaran</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedImage && <img src={selectedImage} alt="Bukti Pembayaran" style={{ width: '100%' }} />}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModal(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default DataPembayaran;
