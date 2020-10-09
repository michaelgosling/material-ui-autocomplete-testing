import React from "react";
import logo from "./logo.svg";
import "./App.css";
import CustomListBox from "./components/CustomListBox";
import { ThemeProvider, useTheme, Theme } from "@material-ui/core";

const randomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = length; i--; ) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

const OPTIONS = Array.from(new Array(10000))
  .map(() => randomString(10 + Math.ceil(Math.random() * 20)))
  .sort((a: string, b: string) =>
    a.toUpperCase().localeCompare(b.toUpperCase())
  );

function App() {
  const theme: Theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            <CustomListBox
              id="testListBox"
              label="Custom List Box"
              options={OPTIONS}
            />
          </p>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
