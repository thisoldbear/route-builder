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
    </div>
  );
}

export default App;
