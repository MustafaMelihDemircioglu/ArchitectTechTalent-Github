import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [rates, setRates] = useState({
    USD: "Loading",
    EUR: "Loading",
    CHF: "Loading",
    RUB: "Loading",
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await axios.get(
          "https://v6.exchangerate-api.com/v6/29b5c30d008067281f4b6561/latest/TRY"
        );
        const { USD, EUR, CHF, RUB } = response.data.conversion_rates;
        setRates({ USD, EUR, CHF, RUB });
      } catch (error) {
        console.error("Error fetching exchange rates", error);
      }
    }

    fetchRates();
  }, []);

  const handleNavigation = () => {
    if (isLoggedIn()) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const isLoggedIn = () => {
    // Implement your login check logic here
    // For example, check if a token exists in localStorage
    return !!localStorage.getItem("token");
  };

  return (
    <AppBar
      position="static"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          style={{
            flexGrow: 1,
            cursor: "pointer",
            fontFamily: "Poppins",
            fontSize: "1.5rem",
          }}
          onClick={handleNavigation}
        >
          Manage Your Finance
        </Typography>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <Typography
            variant="body1"
            style={{ margin: "0 10px", fontFamily: "Roboto Mono" }}
          >
            USD/TRY: {(1 / rates.USD).toFixed(2)}
          </Typography>
          <Typography
            variant="body1"
            style={{ margin: "0 10px", fontFamily: "Roboto Mono" }}
          >
            EUR/TRY: {(1 / rates.EUR).toFixed(2)}
          </Typography>
          <Typography
            variant="body1"
            style={{ margin: "0 10px", fontFamily: "Roboto Mono" }}
          >
            CHF/TRY: {(1 / rates.CHF).toFixed(2)}
          </Typography>
          <Typography
            variant="body1"
            style={{ margin: "0 10px", fontFamily: "Roboto Mono" }}
          >
            RUB/TRY: {(1 / rates.RUB).toFixed(2)}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
