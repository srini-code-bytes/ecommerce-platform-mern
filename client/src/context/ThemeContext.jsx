import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useState, useMemo, createContext, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  // Initialize theme state from localStorage or default to 'light'
  const [mode, setMode] = useState(localStorage.getItem("mode") || "light");

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode])

  const theme = useMemo(
    () =>
      createTheme({
        // Use material UI create theme function
        palette: {
          mode: mode,
          ...(mode === "light"
            ? {
                // palette values for light mode
                primary: {
                  main: "#1976d2",
                },
                secondary: {
                  main: "#9c27b0",
                },
                background: {
                  default: "#f5f5f5",
                  paper: "#ffffff",
                },
              }
            : {
                // palette values for dark mode
                primary: {
                  main: "#90caf9",
                },
                secondary: {
                  main: "#ce93d8",
                },
                background: {
                  default: "#121212",
                  paper: "#1e1e1e",
                },
              }),
        },
      }),
    [mode]
  );

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Memoize the context value to optimize performance to pass in line 63
  const contextValue = useMemo(
    () => ({
      mode,
      toggleMode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext and access theme state and toggle function
export const useThemeContext = () => {
  return useContext(ThemeContext);
}