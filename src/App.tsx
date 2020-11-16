import React from "react";

import { Map } from "./components/Map/Map";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ContextProvider } from "./context/Context";

import "./App.css";

function App() {
  return (
    <div className="app">
      <ContextProvider>
        <Sidebar />
        <Map />
      </ContextProvider>
      <div className="github">
        <img alt="GitHub Logo" src="github.png" />
        <a href="https://github.com/thisoldbear/route-builder">View on GitHub</a>
      </div>
    </div>
  );
}

export default App;
