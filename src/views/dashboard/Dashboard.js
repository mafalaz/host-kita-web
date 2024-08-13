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
  const [modalBukti, setModalBukti] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [modalFotoProduk, setModalFotoProduk] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFotoProduk, setSelectedFotoProduk] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

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
        setHasMore(false); // Karena kita mengambil semua data sekaligus
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleModalBukti = () => {
    setModalBukti(!modalBukti);
  };

  const toggleModalStatus = () => {
    setModalStatus(!modalStatus);
  };

  const toggleModalFotoProduk = () => {
    setModalFotoProduk(!modalFotoProduk);
  };

  const openModalStatus = (orderId) => {
    setSelectedOrderId(orderId);
    toggleModalStatus();
  };

  const openModalBukti = (imageUrl) => {
    setSelectedImage(imageUrl);
    toggleModalBukti();
  };

  const openModalFotoProduk = (imageUrl) => {
    setSelectedFotoProduk(imageUrl);
    toggleModalFotoProduk();
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
      toggleModalStatus(); // Close the modal
    } catch (error) {
      console.error('Error updating status payment:', error);
    }
  };

  const getRandomAvatar = () => {
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const formatCurrency = (value) => {
    return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
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
                    <CTableHeaderCell className="bg-body-tertiary text-center">Foto Produk</CTableHeaderCell>
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
                      <CTableDataCell className="text-center">
                        <img
                          src={order.fotoProduk}
                          alt="Foto Produk"
                          onClick={() => openModalFotoProduk(order.fotoProduk)}
                          style={{
                            cursor: 'pointer',
                            width: '50px', // Ukuran kotak persegi
                            height: '50px', // Ukuran kotak persegi
                            objectFit: 'cover', // Crop gambar
                            borderRadius: '8px' // Membuat sudut kotak persegi
                          }}
                        />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{order.jumlahProduk} pcs</CTableDataCell>
                      <CTableDataCell className="text-center">{new Date(order.tanggalLive).toLocaleDateString()}</CTableDataCell>
                      <CTableDataCell className="text-center">{formatCurrency(order.totalPayment)}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <img
                          src={order.buktiTransfer}
                          alt="Bukti Pembayaran"
                          onClick={() => openModalBukti(order.buktiTransfer)}
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
                        <CButton
                          color={order.statusPayment === 'Sukses' ? 'dark' : 'primary'}
                          onClick={() => openModalStatus(order.orderId)}
                          disabled={order.statusPayment === 'Sukses'}
                        >
                          Cek Payment
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={modalBukti} onClose={() => setModalBukti(false)}>
        <CModalHeader onClose={toggleModalBukti}>
          <CModalTitle>Bukti Pembayaran</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedImage && <img src={selectedImage} alt="Bukti Pembayaran" style={{ width: '100%' }} />}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={toggleModalBukti}>Close</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={modalStatus} onClose={() => setModalStatus(false)}>
        <CModalHeader>
          <CModalTitle>Update Status Payment</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Silahkan pilih status pembayaran:</p>
          <p style={{color:"red"}}>Note:</p>
          <p style={{color:"red"}}>Pastikan Anda sudah cek bukti pembayaran dengan benar. Jika tidak, maka status pembayaran tidak bisa diubah lagi!</p>
          <div>
            <CButton color="success" onClick={() => { updateStatusPayment('Sukses'); }} style={{ marginRight: '10px', color:'white' }}>Sukses</CButton>
            <CButton color="danger" onClick={() => { updateStatusPayment('Pending'); }} style={{ color: 'white'}}>Pending</CButton>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalStatus(false)}>Close</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={modalFotoProduk} onClose={() => setModalFotoProduk(false)}>
        <CModalHeader onClose={toggleModalFotoProduk}>
          <CModalTitle>Foto Produk</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedFotoProduk && <img src={selectedFotoProduk} alt="Foto Produk" style={{ width: '100%' }} />}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={toggleModalFotoProduk}>Close</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Dashboard;
