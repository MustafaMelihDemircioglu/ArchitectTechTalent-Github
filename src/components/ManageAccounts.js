import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";

const ManageAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({ balance: "" });
  const [editAccount, setEditAccount] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://localhost:7125/api/Accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(response.data);
    };
    fetchAccounts();
  }, []);

  const handleAddAccount = async () => {
    const token = localStorage.getItem("token");
    if (!newAccount.balance || newAccount.balance <= 0) {
      setSnackbarSeverity("info");
      setSnackbarMessage("Balance cannot be empty or less than zero");
      setSnackbarOpen(true);
      return;
    }
    try {
      const response = await axios.post(
        "https://localhost:7125/api/Accounts",
        newAccount,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAccounts([...accounts, response.data]);
      setNewAccount({ balance: "" });
      setOpenAddDialog(false);
      setSnackbarMessage("Account added successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to add account");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleEditAccount = async () => {
    const token = localStorage.getItem("token");
    if (!editAccount.balance || editAccount.balance <= 0) {
      setSnackbarSeverity("info");
      setSnackbarMessage("Balance cannot be empty or less than zero");
      setSnackbarOpen(true);
      return;
    }
    try {
      const response = await axios.put(
        `https://localhost:7125/api/Accounts/${editAccount.id}`,
        editAccount,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedAccounts = accounts.map((account) =>
        account.id === editAccount.id ? response.data : account
      );
      setAccounts(updatedAccounts);
      setEditAccount(null);
      setOpenEditDialog(false);
      setSnackbarMessage("Account updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to update account");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteAccount = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://localhost:7125/api/Accounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(accounts.filter((account) => account.id !== id));
      setSnackbarMessage("Account deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to delete account");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setEditAccount(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold", color: "#667eea" }}
      >
        Manage Accounts
      </Typography>
      <Button
        variant="contained"
        onClick={() => setOpenAddDialog(true)}
        sx={{
          mt: 2,
          mb: 2,
          backgroundColor: "#667eea",
          "&:hover": { backgroundColor: "#5a67d8" },
        }}
      >
        Add Account
      </Button>
      <TableContainer
        component={Paper}
        sx={{ boxShadow: 3, borderRadius: "10px" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#667eea",
                  color: "white",
                }}
              >
                Account ID
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#667eea",
                  color: "white",
                }}
              >
                Balance
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#667eea",
                  color: "white",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.id}</TableCell>
                <TableCell>{account.balance}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditAccount(account);
                      setOpenEditDialog(true);
                    }}
                    sx={{
                      mr: 1,
                      borderColor: "#667eea",
                      color: "#667eea",
                      "&:hover": { borderColor: "#5a67d8", color: "#5a67d8" },
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteAccount(account.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openAddDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ backgroundColor: "#667eea", color: "white" }}>
          Add New Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the initial balance for the new account.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Balance"
            type="number"
            fullWidth
            value={newAccount.balance}
            onChange={(e) =>
              setNewAccount({ ...newAccount, balance: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAddAccount}
            sx={{
              backgroundColor: "#667eea",
              color: "white",
              "&:hover": { backgroundColor: "#5a67d8" },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ backgroundColor: "#667eea", color: "white" }}>
          Edit Account Balance
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update the balance for the selected account.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Balance"
            type="number"
            fullWidth
            value={editAccount ? editAccount.balance : ""}
            onChange={(e) =>
              setEditAccount({ ...editAccount, balance: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleEditAccount}
            sx={{
              backgroundColor: "#667eea",
              color: "white",
              "&:hover": { backgroundColor: "#5a67d8" },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default ManageAccounts;
