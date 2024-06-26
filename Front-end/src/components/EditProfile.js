import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Paper, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const EditProfile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    identityNumber: '',
    password: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:7125/api/Users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!profile.password) {
      setErrorDialogOpen(true);
      return;
    }

    try {
      await axios.put('https://localhost:7125/api/Users', {
        email: profile.email,
        password: profile.password ? profile.password : undefined,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDialogClose = () => {
    setErrorDialogOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={10} sx={{ padding: 4, width: '100%', maxWidth: 600, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '15px' }}>
        <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
          Edit Profile
        </Typography>
        <Box component="form" onSubmit={handleUpdate} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            value={profile.firstName}
            InputProps={{
              readOnly: true,
            }}
            sx={{ input: { color: 'white' }, label: { color: 'white' } }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            value={profile.lastName}
            InputProps={{
              readOnly: true,
            }}
            sx={{ input: { color: 'white' }, label: { color: 'white' } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={profile.email}
            onChange={handleChange}
            sx={{ input: { color: 'white' }, label: { color: 'white' } }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="identityNumber"
            label="Identity Number"
            name="identityNumber"
            autoComplete="identityNumber"
            value={profile.identityNumber}
            InputProps={{
              readOnly: true,
            }}
            sx={{ input: { color: 'white' }, label: { color: 'white' } }}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="New Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={profile.password}
            onChange={handleChange}
            sx={{ input: { color: 'white' }, label: { color: 'white' } }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#667eea', '&:hover': { backgroundColor: '#5a67d8' } }}
          >
            Update Profile
          </Button>
        </Box>
      </Paper>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>

      <Dialog open={errorDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>The password field should be filled.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditProfile;
