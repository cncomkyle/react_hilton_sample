import React from "react"
import { Route, Routes } from "react-router-dom"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom"

// We will create these two pages in a moment
import CheckReservationsPage from "./pages/CheckReservationsPage"
import LoginPage from './pages/LoginPage'
import ReserveTablePage from "./pages/ReserveTablePage";
import ReviewTablesStatusPage from "./pages/ReviewTablesStatusPage";

export default function App() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState('login');
  const handleChange = (event, newValue) => {
    setValue(newValue);
    testFlg = true
    navigate(newValue);
  };

  let testFlg = false;

  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/reserveTable' element={<ReserveTablePage />} />
      <Route path='/checkReservations' element={<CheckReservationsPage />} />
      <Route path='/reviewTableStatus' element={<ReviewTablesStatusPage />} />
    </Routes>


  )
}