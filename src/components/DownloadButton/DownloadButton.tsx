import React, { useContext } from "react";
import "./DownloadButton.scss";
import { Context } from "../../context/Context";

export const DownloadButton: React.FC = () => {
  const { state } = useContext(Context);

  return state.gpx ? (
    <button
      className="download-button"
      onClick={() => {
        const data = new Blob([state.gpx], { type: "application/gpx" });
        const gpxUrl = window.URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = gpxUrl;
        link.setAttribute("download", "route.gpx");
        link.click();
      }}
    >
      Download your Route
    </button>
  ) : null;
};
