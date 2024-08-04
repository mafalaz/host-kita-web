import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilAddressBook,
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCreditCard,
  cilCursor,
  cilDataTransferUp,
  cilDescription,
  cilDollar,
  cilDrop,
  cilNotes,
  cilPenAlt,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilWallet,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  
  },
  {
    component: CNavItem,
    name: 'Rekening',
    to: '/rekening',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Payment To Costumer',
    to: '/payment-to-customer',
    icon: <CIcon icon={cilDataTransferUp} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Data Pembayaran',
    to: '/data-pembayaran',
    icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Input Jadwal',
    to: '/input-jadwal',
    icon: <CIcon icon={cilPenAlt} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Jadwal Host Live',
    to: '/jadwal-host-live',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Input Penjualan',
    to: '/input-penjualan',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Penjualan',
    to: '/penjualan',
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
  },
  
]

export default _nav
