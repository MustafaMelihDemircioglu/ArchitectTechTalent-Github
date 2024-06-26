import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const RegisterPage = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    identityNumber: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      setSnackbarMessage("Passwords do not match");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    try {
      await axios.post("https://localhost:7125/api/Users/register", user);
      setSnackbarMessage("Registration successful");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/");
      }, 1500); // Delay navigation to show the success message
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Identity number is already registered");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleIdentityNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setUser({ ...user, identityNumber: value });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{ padding: 4, maxWidth: 400, margin: "auto", marginTop: 8 }}
    >
      <Typography component="h1" variant="h5" align="center">
        Register
      </Typography>
      <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="firstName"
          label="First Name"
          name="firstName"
          autoComplete="given-name"
          autoFocus
          value={user.firstName}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="lastName"
          label="Last Name"
          name="lastName"
          autoComplete="family-name"
          value={user.lastName}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={user.email}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="identityNumber"
          label="Identity Number"
          name="identityNumber"
          autoComplete="identityNumber"
          value={user.identityNumber}
          onChange={handleIdentityNumberChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={user.password}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          value={user.confirmPassword}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </Button>
        <Box display="flex" justifyContent="center">
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/")}
          >
            Already have an account? Sign In
          </Link>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default RegisterPage;
