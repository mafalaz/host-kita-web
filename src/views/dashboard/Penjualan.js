import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  CRow, 
  CCol, 
  CCard, 
  CCardHeader, 
  CCardBody, 
  CTable, 
  CTableHead, 
  CTableRow, 
  CTableHeaderCell, 
  CTableBody, 
  CTableDataCell, 
  CModal, 
  CModalHeader, 
  CModalTitle, 
  CModalBody, 
  CModalFooter 
} from '@coreui/react';

const Penjualan = () => {
  const [penjualan, setPenjualan] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/allPenjualan', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.status) {
        setPenjualan(response.data.listPenjualan);
        setHasMore(false); // Karena kita mengambil semua data sekaligus
      }
    } catch (error) {
      console.error('Error fetching rekening:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatCurrency = (value) => {
    return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Data Penjualan</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Penjualan Id</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">UMKM</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Email</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Nama Produk</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Harga Produk Satuan</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Jumlah Produk</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Sisa Produk</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Total Checkout</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Total Pendapatan</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Tanggal Update Penjualan</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {penjualan.map((penjualanUser, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="text-center">{penjualanUser.penjualanId}</CTableDataCell>
                      <CTableDataCell className="text-center">{penjualanUser.nama_umkm}</CTableDataCell>
                      <CTableDataCell className="text-center">{penjualanUser.email}</CTableDataCell>
                      <CTableDataCell className="text-center">{penjualanUser.namaProduk}</CTableDataCell>
                      <CTableDataCell className="text-center">{formatCurrency(penjualanUser.hargaProduk)}</CTableDataCell>
                      <CTableDataCell className="text-center">{penjualanUser.jumlahProduk}</CTableDataCell>
                      <CTableDataCell className="text-center">{penjualanUser.sisaProduk}</CTableDataCell>
                      <CTableDataCell className="text-center">{penjualanUser.totalCheckout}</CTableDataCell>
                      <CTableDataCell className="text-center">{formatCurrency(penjualanUser.totalPendapatan)}</CTableDataCell>
                      <CTableDataCell className="text-center">{formatDate(penjualanUser.tanggalUpdatePenjualan)}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
}

export default Penjualan;
