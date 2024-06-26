import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, Link, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Alert, AlertTitle } from '@mui/material';
import axios from 'axios';
import ErrorIcon from '@mui/icons-material/Error';

const HomePage = () => {
  const [identityNumber, setIdentityNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7125/api/Users/login', { identityNumber, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setLoginFailed(true);
    }
  };

  const handleCloseDialog = () => {
    setLoginFailed(false);
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, margin: 'auto', marginTop: 8 }}>
        <Typography component="h1" variant="h5" align="center">Login</Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="identityNumber"
            label="Identity Number"
            name="identityNumber"
            autoComplete="identityNumber"
            autoFocus
            value={identityNumber}
            onChange={(e) => setIdentityNumber(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Box display="flex" justifyContent="center">
            <Link component="button" variant="body2" onClick={() => navigate('/register')}>
              Do not have an account? Sign Up
            </Link>
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={loginFailed}
        onClose={handleCloseDialog}
        
        PaperProps={{
          sx: {
            backgroundColor: '#fefefe',
            padding: 2,
            borderRadius: 2,
            boxShadow: 5,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d32f2f' }}>
          <ErrorIcon sx={{ fontSize: 50, marginRight: 1 }} />
          Login Failed
        </DialogTitle>
        <DialogContent>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            The identity number or password you entered is incorrect. Please try again.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleCloseDialog} color="primary" variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage;
