import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, Box, Button, TextField, MenuItem, Select, InputLabel, FormControl,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid,
  Snackbar, Alert
} from '@mui/material';

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ amount: '', category: '', date: '', time: '' });
  const [editExpense, setEditExpense] = useState(null);
  const [categories, setCategories] = useState(['Food', 'Transport', 'Entertainment', 'Health', 'Other']);
  const [filter, setFilter] = useState({ category: '', fromDate: '', toDate: '' });
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:7125/api/Transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(response.data);
      setFilteredExpenses(response.data);
    };
    fetchExpenses();
  }, []);

  const handleAddExpense = async () => {
    if (!validateForm(newExpense)) return;

    const token = localStorage.getItem('token');
    const combinedDateTime = new Date(`${newExpense.date}T${newExpense.time}`).toISOString();
    try {
      const response = await axios.post('https://localhost:7125/api/Transactions', { ...newExpense, date: combinedDateTime }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedExpenses = [...expenses, response.data];
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
      setNewExpense({ amount: '', category: '', date: '', time: '' });
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert('Failed to add expense');
    }
  };

  const handleUpdateExpense = async () => {
    if (!validateForm(editExpense)) return;

    const token = localStorage.getItem('token');
    const combinedDateTime = new Date(`${editExpense.date}T${editExpense.time}`).toISOString();
    try {
      await axios.put(`https://localhost:7125/api/Transactions/${editExpense.id}`, { ...editExpense, date: combinedDateTime }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedExpenses = expenses.map(expense => (expense.id === editExpense.id ? editExpense : expense));
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
      setEditExpense(null);
    } catch (error) {
      console.error(error);
      alert('Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://localhost:7125/api/Transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
    } catch (error) {
      console.error(error);
      alert('Failed to delete expense');
    }
  };

  const handleCloseDialog = () => {
    setEditExpense(null);
    setOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const applyFilters = () => {
    let filtered = expenses;

    if (filter.category && filter.category !== "All") {
      filtered = filtered.filter(expense => expense.category === filter.category);
    }

    if (filter.category === "All") {
      filtered = expenses;
    }

    if (filter.fromDate) {
      filtered = filtered.filter(expense => new Date(expense.date) >= new Date(filter.fromDate));
    }

    if (filter.toDate) {
      filtered = filtered.filter(expense => new Date(expense.date) <= new Date(filter.toDate));
    }

    setFilteredExpenses(filtered);
  };

  const validateForm = (expense) => {
    if (!expense.amount || !expense.category || !expense.date || !expense.time) {
      setErrorMessage('All fields must be filled out');
      return false;
    }
    return true;
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography component="h2" variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#667eea' }}>
        Expense Management
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2, justifyContent: 'center' }}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              label="Category"
              value={filter.category}
              onChange={handleFilterChange}
            >
              <MenuItem value="All">All</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            name="fromDate"
            label="From Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={filter.fromDate}
            onChange={handleFilterChange}
            margin="dense"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            name="toDate"
            label="To Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={filter.toDate}
            onChange={handleFilterChange}
            margin="dense"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Button variant="contained" fullWidth onClick={applyFilters} sx={{ mb: 2, backgroundColor: '#667eea', '&:hover': { backgroundColor: '#5a67d8' } }}>
            Apply Filters
          </Button>
          <Button variant="contained" fullWidth onClick={() => setOpen(true)} sx={{ backgroundColor: '#667eea', '&:hover': { backgroundColor: '#5a67d8' } }}>
            Add Expense
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: '10px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#667eea', color: 'white' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#667eea', color: 'white' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#667eea', color: 'white' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#667eea', color: 'white' }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#667eea', color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.amount}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{formatDate(expense.date)}</TableCell>
                <TableCell>{formatTime(expense.date)}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => setEditExpense({
                    ...expense,
                    date: expense.date.split('T')[0],
                    time: new Date(expense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  })} sx={{ mr: 1, borderColor: '#667eea', color: '#667eea', '&:hover': { borderColor: '#5a67d8', color: '#5a67d8' } }}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteExpense(expense.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open || !!editExpense} onClose={handleCloseDialog}>
        <DialogTitle sx={{ backgroundColor: '#667eea', color: 'white' }}>{editExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the details of the expense.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={editExpense ? editExpense.amount : newExpense.amount}
            onChange={(e) => editExpense ? setEditExpense({ ...editExpense, amount: e.target.value }) : setNewExpense({ ...newExpense, amount: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={editExpense ? editExpense.category : newExpense.category}
              label="Category"
              onChange={(e) => editExpense ? setEditExpense({ ...editExpense, category: e.target.value }) : setNewExpense({ ...newExpense, category: e.target.value })}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={editExpense ? editExpense.date : newExpense.date}
            onChange={(e) => editExpense ? setEditExpense({ ...editExpense, date: e.target.value }) : setNewExpense({ ...newExpense, date: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Time"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={editExpense ? editExpense.time : newExpense.time}
            onChange={(e) => editExpense ? setEditExpense({ ...editExpense, time: e.target.value }) : setNewExpense({ ...newExpense, time: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={editExpense ? handleUpdateExpense : handleAddExpense} sx={{ backgroundColor: '#667eea', color: 'white', '&:hover': { backgroundColor: '#5a67d8' } }}>
            {editExpense ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
        <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExpenseManagement;
