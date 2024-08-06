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

const JadwalHostLive = () => {
  const [jadwal, setJadwal] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/allJadwal', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.status) {
        setJadwal(response.data.listJadwal);
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
            <CCardHeader>Data Jadwal Host Live Streaming</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Jadwal Id</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">UMKM</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Email</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Nama Produk</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Nama Host Live</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Tanggal Live</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {jadwal.map((jadwalUser, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="text-center">{jadwalUser.jadwalLiveId}</CTableDataCell>
                      <CTableDataCell className="text-center">{jadwalUser.nama_umkm}</CTableDataCell>
                      <CTableDataCell className="text-center">{jadwalUser.email}</CTableDataCell>
                      <CTableDataCell className="text-center">{jadwalUser.namaProduk}</CTableDataCell>
                      <CTableDataCell className="text-center">{jadwalUser.namaHostLive}</CTableDataCell>
                      <CTableDataCell className="text-center">{formatDate(jadwalUser.tanggalLive)}</CTableDataCell>
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

export default JadwalHostLive;
