import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CInputGroup, CInputGroupText, CFormInput, CFormLabel, CButton, CRow, CCol, CCard, CCardHeader, CCardBody, CFormSelect } from '@coreui/react';
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

const PaymentToCustomer = () => {
  const [rekening, setRekening] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [value, setValue] = useState('');

  const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleInputChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const formattedValue = formatNumber(rawValue);
    setValue(formattedValue);
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://192.168.1.3:5000/api/user/getAllRekening', {
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

  const getRandomAvatar = () => {
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Payment To Customer</CCardHeader>
            <CCardBody>
              <CInputGroup className="mb-3">
                <CInputGroupText as="label" htmlFor="inputGroupSelect01">Order Id</CInputGroupText>
                <CFormSelect id="inputGroupSelect01">
                  <option>Pilih...</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </CFormSelect>
              </CInputGroup>

              <CInputGroup className="mb-3">
                <CInputGroupText as="label" htmlFor="inputGroupSelect01">Nama UMKM</CInputGroupText>
                <CFormSelect id="inputGroupSelect01">
                  <option>Pilih...</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </CFormSelect>
              </CInputGroup>

              <CInputGroup className="mb-3">
                <CInputGroupText as="label" htmlFor="inputGroupSelect01">Email</CInputGroupText>
                <CFormSelect id="inputGroupSelect01">
                  <option>Pilih...</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </CFormSelect>
              </CInputGroup>


              <CFormLabel htmlFor="total-payment">Total Pembayaran</CFormLabel>
              <CInputGroup className="mb-3">
                <CInputGroupText>Rp</CInputGroupText>
                <CFormInput
                  id="total-payment"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  aria-label="Amount (to the nearest dollar)"
                  value={value}
                  onChange={handleInputChange}
                />
              </CInputGroup>

              <div className="mb-3">
                <CFormLabel htmlFor="formFile">Bukti Pembayaran</CFormLabel>
                <CFormInput type="file" id="formFile" />
              </div>

              <CFormLabel htmlFor="payment-date">Tanggal Pembayaran</CFormLabel>
              <CInputGroup className="mb-3">
                <CFormInput type="date" id="payment-date" />
              </CInputGroup>

              <div className="d-grid gap-2">
                <CButton color="primary">Submit</CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
}

export default PaymentToCustomer;

