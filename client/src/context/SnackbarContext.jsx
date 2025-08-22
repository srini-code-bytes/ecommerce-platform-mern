import { Alert, Snackbar } from "@mui/material";
import { createContext, useCallback, useContext, useState } from "react";

// CREATE THE CONTEXT
const SnackbarContext = createContext();

// CREATE THE PROVIDER COMPONENT
export function SnackbarProvider({ children }) {
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    severity: "info",
    autoHideDuration: 3000,
  });

  const showSnackbar = useCallback(
    ({ message, severity = "info", autoHideDuration = 5000 }) => {
      setSnackbarData({
        open: true,
        message,
        severity,
        autoHideDuration,
      });
    },
    []
  );

  const hideSnackbar = useCallback(() => {
    setSnackbarData((prev) => ({
      ...prev,
      open: false,
    }));
  });

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        open={snackbarData.open}
        autoHideDuration={snackbarData.autoHideDuration}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          top: "70px",
          "& .MuiPaper-root": {
            boxShadow: "none",
            width: "fit-content",
            height: "fit-content",
          },
        }}
      >
        <Alert
          onClose={hideSnackbar}
          severity={snackbarData.severity}
          sx={{ width: "250px", height: "50px" }}
        >
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}
