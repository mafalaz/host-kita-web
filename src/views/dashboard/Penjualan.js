import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CInputGroup,
  CInputGroupText
} from '@coreui/react';

const Penjualan = () => {
  const [penjualan, setPenjualan] = useState([]);
  const [selectedNamaUmkm, setSelectedNamaUmkm] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/allPenjualan', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        setPenjualan(response.data.listPenjualan);
      }
    } catch (error) {
      console.error('Error fetching penjualan:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderChange = (event) => {
    setSelectedNamaUmkm(event.target.value);
  };

  const formatCurrency = (value) => {
    return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Mengumpulkan nama UMKM yang unik
  const uniqueNamaUmkm = [...new Set(penjualan.map((order) => order.nama_umkm))];

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Data Penjualan</CCardHeader>
            <CCardBody>
            <CInputGroup className="mb-3">
              <CInputGroupText as="label" htmlFor="orderSelect">Nama UMKM</CInputGroupText>
              <CFormSelect id="penjualanSelect" onChange={handleOrderChange} value={selectedNamaUmkm || ''}>
                <option value="">Pilih...</option>
                {uniqueNamaUmkm.map((namaUmkm) => (
                  <option key={namaUmkm} value={namaUmkm}>
                    {namaUmkm}
                  </option>
                ))}
              </CFormSelect>
            </CInputGroup>
              <p></p>
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
                  {penjualan
                    .filter((penjualanUser) => !selectedNamaUmkm || penjualanUser.nama_umkm === selectedNamaUmkm)
                    .map((penjualanUser, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell className="text-center">{penjualanUser.penjualanId}</CTableDataCell>
                        <CTableDataCell className="text-center">{penjualanUser.nama_umkm}</CTableDataCell>
                        <CTableDataCell className="text-center">{penjualanUser.email}</CTableDataCell>
                        <CTableDataCell className="text-center">{penjualanUser.namaProduk}</CTableDataCell>
                        <CTableDataCell className="text-center">{formatCurrency(penjualanUser.hargaProduk)}</CTableDataCell>
                        <CTableDataCell className="text-center">{penjualanUser.jumlahProduk} Pcs</CTableDataCell>
                        <CTableDataCell className="text-center">{penjualanUser.sisaProduk} Pcs</CTableDataCell>
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
};

export default Penjualan;
