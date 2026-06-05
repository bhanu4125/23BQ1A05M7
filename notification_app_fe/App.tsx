// App.tsx

import React, { useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import HomePage from "./pages/HomePage";
import { Log }  from "./utils/logger";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

function App() {
  useEffect(() => {
    Log("frontend", "info", "page", "app initialized");
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HomePage />
    </ThemeProvider>
  );
}

export default App;