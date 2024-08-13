import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAvatar, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople } from '@coreui/icons';
const Rekening = () => {
  const [rekening, setRekening] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/user/getAllRekening', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.status) {
        setRekening(response.data.rekening);
        setHasMore(false); // Karena kita mengambil semua data sekaligus
      }
    } catch (error) {
      console.error('Error fetching rekening:', error);
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

  const handleSubmit = (noTelepon) => {
    const waLink = `https://wa.me/${noTelepon}`;
    window.open(waLink, '_blank');
  };

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Data User Rekening</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    {/* <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell> */}
                    <CTableHeaderCell className="bg-body-tertiary text-center">Rekening Id</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">UMKM</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Email</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Nomor Rekening</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Nama Bank</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Atas Nama</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Nomor Whatsapp</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {rekening.map((rekeningUser, index) => (
                    <CTableRow key={index}>
                      {/* <CTableDataCell className="text-center">
                        <CAvatar size="md" src={getRandomAvatar()} />
                      </CTableDataCell> */}
                      <CTableDataCell className="text-center">{rekeningUser.rekeningId}</CTableDataCell>
                      <CTableDataCell className="text-center">{rekeningUser.nama_umkm}</CTableDataCell>
                      <CTableDataCell className="text-center">{rekeningUser.email}</CTableDataCell>
                      <CTableDataCell className="text-center">{rekeningUser.noRekening}</CTableDataCell>
                      <CTableDataCell className="text-center">{rekeningUser.namaBank}</CTableDataCell>
                      <CTableDataCell className="text-center">{rekeningUser.atasNama}</CTableDataCell>
                      <CTableDataCell className="text-center"><CButton color="primary" onClick={() => handleSubmit(rekeningUser.noTelepon)}>{rekeningUser.noTelepon}</CButton></CTableDataCell>
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

export default Rekening;

