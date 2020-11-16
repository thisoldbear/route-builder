import React from "react";
import "./Sidebar.scss";

import { WaypointsList } from "../WaypointsList/WaypointsList";
import { DownloadButton } from "../DownloadButton/DownloadButton";

export const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h1>Route Builder</h1>
      <WaypointsList />
      <DownloadButton />
    </div>
  );
};
