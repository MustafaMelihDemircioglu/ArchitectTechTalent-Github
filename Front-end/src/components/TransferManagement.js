import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Snackbar,
  Alert,
} from "@mui/material";

const TransferManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [newTransfer, setNewTransfer] = useState({
    fromAccountId: "",
    toAccountId: "",
    amount: "",
  });
  const [transferType, setTransferType] = useState("");
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [tab, setTab] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://localhost:7125/api/Accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(response.data);
    };
    fetchAccounts();
  }, [open]);

  useEffect(() => {
    const fetchTransfers = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://localhost:7125/api/Transfers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransfers(response.data);
    };
    fetchTransfers();
  }, [open]);

  const validateForm = () => {
    if (
      !newTransfer.fromAccountId ||
      !newTransfer.toAccountId ||
      !newTransfer.amount
    ) {
      setErrorMessage("All fields must be filled out");
      return false;
    }
    return true;
  };

  const handleAddTransfer = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    const currentDateTime = new Date().toISOString();

    const fromAccount = accounts.find(
      (account) => account.id === newTransfer.fromAccountId
    );
    if (parseFloat(newTransfer.amount) > parseFloat(fromAccount.balance)) {
      setAlertMessage("Insufficient funds in the selected account.");
      setAlertOpen(true);
      return;
    }

    if (
      transferType === "external" &&
      accounts.some((account) => account.id === newTransfer.toAccountId)
    ) {
      setAlertMessage("You cannot transfer money to your own account.");
      setAlertOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7125/api/Transfers",
        { ...newTransfer, date: currentDateTime },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransfers([...transfers, response.data]);
      setNewTransfer({ fromAccountId: "", toAccountId: "", amount: "" });
      setOpen(false);
    } catch (error) {
      console.error(error);
      setErrorMessage("Specified account could not be found.")
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleOpenDialog = (type) => {
    setTransferType(type);
    setOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const filterToAccounts = () => {
    if (transferType === "internal") {
      return accounts.filter(
        (account) => account.id !== newTransfer.fromAccountId
      );
    }
    return accounts;
  };

  const filterTransfers = (type) => {
    if (type === "internal") {
      return transfers.filter(
        (transfer) =>
          accounts.some((account) => account.id === transfer.fromAccountId) &&
          accounts.some((account) => account.id === transfer.toAccountId)
      );
    } else if (type === "external") {
      return transfers.filter(
        (transfer) =>
          accounts.some((account) => account.id === transfer.fromAccountId) &&
          !accounts.some((account) => account.id === transfer.toAccountId)
      );
    }
    return transfers;
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        component="h2"
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold", color: "#667eea" }}
      >
        Transfer Management
      </Typography>
      <Tabs value={tab} onChange={handleTabChange} centered>
        <Tab label="Transfer Between My Accounts" />
        <Tab label="To Another Account" />
      </Tabs>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog(tab === 0 ? "internal" : "external")}
          sx={{
            backgroundColor: "#667eea",
            "&:hover": { backgroundColor: "#5a67d8" },
          }}
        >
          {tab === 0
            ? "New Transfer Between My Accounts"
            : "New Transfer to Another Account"}
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        sx={{ mt: 2, boxShadow: 3, borderRadius: "10px" }}
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
                From Account
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#667eea",
                  color: "white",
                }}
              >
                To Account
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#667eea",
                  color: "white",
                }}
              >
                Amount
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#667eea",
                  color: "white",
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#667eea",
                  color: "white",
                }}
              >
                Time
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterTransfers(tab === 0 ? "internal" : "external").map(
              (transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>{transfer.fromAccountId}</TableCell>
                  <TableCell>{transfer.toAccountId}</TableCell>
                  <TableCell>{transfer.amount}</TableCell>
                  <TableCell>{formatDate(transfer.date)}</TableCell>
                  <TableCell>{formatTime(transfer.date)}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleCloseDialog}
        sx={{
          "& .MuiDialog-paper": {
            width: "40vw",
            maxWidth: "none",
            margin: "auto",
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: "#667eea", color: "white" }}>
          {transferType === "internal"
            ? "Transfer Between My Accounts"
            : "Transfer to Another Account"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ margin: "10px" }}>
            Please fill out the details of the new transfer.
          </DialogContentText>
          <FormControl fullWidth margin="dense">
            <InputLabel>From Account</InputLabel>
            <Select
              label="From Account"
              value={newTransfer.fromAccountId}
              onChange={(e) =>
                setNewTransfer({
                  ...newTransfer,
                  fromAccountId: e.target.value,
                })
              }
            >
              {accounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.id} - Balance: ${account.balance}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {transferType === "internal" ? (
            <FormControl fullWidth margin="dense">
              <InputLabel>To Account</InputLabel>
              <Select
                label="To Account"
                value={newTransfer.toAccountId}
                onChange={(e) =>
                  setNewTransfer({
                    ...newTransfer,
                    toAccountId: e.target.value,
                  })
                }
              >
                {filterToAccounts().map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.id} - Balance: ${account.balance}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              margin="dense"
              label="To Account"
              type="text"
              fullWidth
              value={newTransfer.toAccountId}
              onChange={(e) =>
                setNewTransfer({ ...newTransfer, toAccountId: e.target.value })
              }
            />
          )}
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={newTransfer.amount}
            onChange={(e) =>
              setNewTransfer({ ...newTransfer, amount: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAddTransfer}
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
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      {alertOpen && (
        <Dialog open={alertOpen} onClose={handleCloseAlert}>
          <DialogTitle>Insufficient Funds</DialogTitle>
          <DialogContent>
            <DialogContentText>{alertMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAlert}>OK</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default TransferManagement;
