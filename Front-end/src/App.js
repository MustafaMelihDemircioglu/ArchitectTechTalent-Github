import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import EditProfile from './components/EditProfile';
import ExpenseManagement from './components/ExpenseManagement';
import TransferManagement from './components/TransferManagement';
import ManageAccounts from './components/ManageAccounts';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="md">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/expenses" element={<PrivateRoute><ExpenseManagement /></PrivateRoute>} />
          <Route path="/transfers" element={<PrivateRoute><TransferManagement /></PrivateRoute>} />
          <Route path="/manage-accounts" element={<PrivateRoute><ManageAccounts /></PrivateRoute>} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
