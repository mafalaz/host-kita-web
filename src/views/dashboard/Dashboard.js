import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople } from '@coreui/icons';

const avatars = [
  'src/assets/images/avatars/Asset_1.svg',
];

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [modal, setModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://192.168.1.3:5000/api/user/allOrder', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.status) {
        setOrders(response.data.orderUser);
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

  const updateStatusPayment = async (status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/user/updateStatusPayment/${selectedOrderId}`, {
        statusPayment: status
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Update the order status locally
      setOrders(orders.map(order => 
        order.orderId === selectedOrderId ? { ...order, statusPayment: status } : order
      ));
      toggleModal(); // Close the modal
    } catch (error) {
      console.error('Error updating status payment:', error);
    }
  };

  const getRandomAvatar = () => {
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Data User Order Live</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Order Id</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">UMKM</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Email</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Produk</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Jumlah Produk</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Tanggal Live</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Total Pembayaran</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Bukti Pembayaran</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Status Pembayaran</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Cek Payment</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {orders.map((order, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="text-center">
                        <img
                          src={order.fotoUmkm || getRandomAvatar()}
                          alt="Avatar"
                          style={{
                            width: '50px', // Ukuran kotak persegi
                            height: '50px', // Ukuran kotak persegi
                            objectFit: 'cover', // Crop gambar
                            borderRadius: '8px' // Membuat sudut kotak persegi
                          }}
                        />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{order.orderId}</CTableDataCell>
                      <CTableDataCell className="text-center">{order.nama_umkm}</CTableDataCell>
                      <CTableDataCell className="text-center">{order.email}</CTableDataCell>
                      <CTableDataCell className="text-center">{order.namaProduk}</CTableDataCell>
                      <CTableDataCell className="text-center">{order.jumlahProduk} pcs</CTableDataCell>
                      <CTableDataCell className="text-center">{new Date(order.tanggalLive).toLocaleDateString()}</CTableDataCell>
                      <CTableDataCell className="text-center">{order.totalPayment}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <img
                          src={order.buktiTransfer}
                          alt="Bukti Pembayaran"
                          onClick={() => openModal(order.buktiTransfer)}
                          style={{
                            cursor: 'pointer',
                            width: '50px', // Ukuran kotak persegi
                            height: '50px', // Ukuran kotak persegi
                            objectFit: 'cover', // Crop gambar
                            borderRadius: '8px' // Membuat sudut kotak persegi
                          }}
                        />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{order.statusPayment}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton color="primary" onClick={() => openModal(order.buktiTransfer)}>Cek Bukti</CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={modal} onClose={toggleModal}>
        <CModalHeader onClose={toggleModal}>
          <CModalTitle>Bukti Pembayaran</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedImage && <img src={selectedImage} alt="Bukti Pembayaran" style={{ width: '100%' }} />}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={toggleModal}>Close</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Dashboard;
