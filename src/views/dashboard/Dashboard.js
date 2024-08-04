import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAvatar, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople } from '@coreui/icons';

const avatars = [
  'src/assets/images/avatars/Asset_1.svg',
  'src/assets/images/avatars/Asset_2.svg',
  'src/assets/images/avatars/Asset_3.svg',
  'src/assets/images/avatars/Asset_4.svg',
  'src/assets/images/avatars/Asset_5.svg',
  'src/assets/images/avatars/Asset_6.svg',
  'src/assets/images/avatars/Asset_7.svg',
  'src/assets/images/avatars/Asset_8.svg',
  'src/assets/images/avatars/Asset_9.svg',
  'src/assets/images/avatars/Asset_10.svg',
  'src/assets/images/avatars/Asset_11.svg',
  'src/assets/images/avatars/Asset_12.svg',
  'src/assets/images/avatars/Asset_13.svg',
  'src/assets/images/avatars/Asset_14.svg',
  'src/assets/images/avatars/Asset_15.svg',
  'src/assets/images/avatars/Asset_16.svg',
  'src/assets/images/avatars/Asset_17.svg',
  'src/assets/images/avatars/Asset_18.svg',
  'src/assets/images/avatars/Asset_19.svg',
  'src/assets/images/avatars/Asset_20.svg',
  'src/assets/images/avatars/Asset_21.svg',
];

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

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

  const openModal = (orderId) => {
    setSelectedOrderId(orderId);
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
                        <CAvatar size="md" src={getRandomAvatar()} />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{order.orderId}</CTableDataCell>
                      <CTableDataCell className="text-center">{order.nama_umkm}</CTableDataCell>
                      <CTableDataCell className="text-center">{order.email}</CTableDataCell>
                      <CTableDataCell className="text-center">{order.namaProduk}</CTableDataCell>
                      <CTableDataCell className="text-center">{order.jumlahProduk} pcs</CTableDataCell>
                      <CTableDataCell className="text-center">{new Date(order.tanggalLive).toLocaleDateString()}</CTableDataCell>
                      <CTableDataCell className="text-center">{order.totalPayment}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={order.buktiTransfer} />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{order.statusPayment}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton color="primary" onClick={() => openModal(order.orderId)}>Cek Bukti</CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={modal} onClose={() => setModal(false)}>
        <CModalHeader>
          <CModalTitle>Update Status Payment</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Silahkan pilih status pembayaran:</p>
          <div>
            <CButton color="success" onClick={() => { updateStatusPayment('Sukses'); toggleModal(); }} style={{ marginRight: '10px', color:'white' }}>Sukses</CButton>
            <CButton color="danger" onClick={() => { updateStatusPayment('Pending'); toggleModal(); }} style={{ color: 'white'}}>Pending</CButton>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModal(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default Dashboard;

