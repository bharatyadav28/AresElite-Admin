import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import store from "./Redux/store";
import { Provider } from "react-redux";
import { ThemeProvider, colors, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    formBackground: {
      main: colors.grey[100],
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
);
