import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Grid, Card, CardContent, Avatar, Paper, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoneyIcon from '@mui/icons-material/Money';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:7125/api/Users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    };
    fetchUser();

    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={10} sx={{ padding: 4, mb: 4, width: '100%', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '15px', position: 'relative' }}>
        <Avatar sx={{ width: 80, height: 80, margin: '0 auto', bgcolor: 'primary.main', fontSize: '2rem' }}>
          {user.firstName && user.firstName[0]}
        </Avatar>
        <Typography variant="h5" component="div" sx={{ mt: 2, fontWeight: 'bold' }}>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem' }}>
          {dateTime.toLocaleString()}
        </Typography>
        <IconButton onClick={handleLogout} sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}>
          <LogoutIcon />
        </IconButton>
      </Paper>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={10} 
            sx={{ borderRadius: '15px', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)', cursor: 'pointer' } }}
            onClick={() => navigate('/edit-profile')}
          >
            <CardContent sx={{ textAlign: 'center', height: '250px' }}>
              <AccountCircleIcon sx={{ fontSize: 50, mb: 1, color: '#667eea' }} />
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                Edit Profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update your personal information and password.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={10} 
            sx={{ borderRadius: '15px', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)', cursor: 'pointer' } }}
            onClick={() => navigate('/expenses')}
          >
            <CardContent sx={{ textAlign: 'center', height: '250px' }}>
              <MoneyIcon sx={{ fontSize: 50, mb: 1, color: '#667eea' }} />
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                Manage Expenses
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track and manage your expenses effectively.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={10} 
            sx={{ borderRadius: '15px', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)', cursor: 'pointer' } }}
            onClick={() => navigate('/transfers')}
          >
            <CardContent sx={{ textAlign: 'center', height: '250px' }}>
              <CompareArrowsIcon sx={{ fontSize: 50, mb: 1, color: '#667eea' }} />
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                Transfer Money
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Make transfers between your accounts or to others.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={10} 
            sx={{ borderRadius: '15px', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)', cursor: 'pointer' } }}
            onClick={() => navigate('/manage-accounts')}
          >
            <CardContent sx={{ textAlign: 'center', height: '250px' }}>
              <ManageAccountsIcon sx={{ fontSize: 50, mb: 1, color: '#667eea' }} />
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                Manage Accounts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View, create, and delete your accounts.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
