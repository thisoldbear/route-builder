import React, { useEffect, useRef, useContext } from "react";
import Leaflet, { LeafletMouseEvent } from "leaflet";
import LeafletGpx from "leaflet-gpx";

import "leaflet/dist/leaflet.css";
import "./Map.scss";

import {
  Context,
  WaypointsState,
  WaypointsActionType,
} from "../../context/Context";
import { Marker } from "../Marker/Marker";

const renderMarkers = (markers: WaypointsState, map: Leaflet.Map) =>
  Object.entries(markers).map((marker) => {
    const [id, value] = marker;
    return (
      <Marker
        id={id}
        key={id}
        map={map}
        lat={value.lat}
        lng={value.lng}
        number={value.number}
      />
    );
  });

export const Map: React.FC = () => {
  const mapEl = useRef(null);
  const mapObj = useRef(null);
  const mapGpx = useRef(null);

  const { waypointsState, waypointsDispatch, gpxState } = useContext(Context);

  // Setup map
  useEffect(() => {
    if (mapObj.current) {
      return;
    }

    // Init map
    mapObj.current = Leaflet.map(mapEl.current, {
      scrollWheelZoom: false,
      dragging: !Leaflet.Browser.mobile,
      tap: !Leaflet.Browser.mobile,
    })
      .setView([51.4446,-2.6449], 15)
      .on("click", (e: LeafletMouseEvent) => {
        waypointsDispatch({
          type: WaypointsActionType.Add,
          payload: {
            ...e.latlng,
          },
        });
      });

    // OSM tiles
    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapObj.current);
  }, [waypointsDispatch]);

  // Setup gpx
  useEffect(() => {
    // If the gpx data is null, clear the map so no
    // old gpx data is still rendered
    if (gpxState == null) {
      if (mapGpx.current) {
        mapObj.current.removeLayer(mapGpx.current);
      }
      return;
    }

    // Clear the current line before drawing a new one
    if (mapGpx.current || gpxState == null) {
      mapObj.current.removeLayer(mapGpx.current);
    }

    // Plot GPX
    mapGpx.current = new LeafletGpx.GPX(gpxState, {
      async: true,
      polyline_options: {
        color: "#0f86e8",
        opacity: 0.95,
        weight: 5,
        lineCap: "round",
      },
      marker_options: {
        startIconUrl: "marker-icon.png",
        endIconUrl: "marker-icon.png",
        iconSize: [0, 0],
        popupAnchor: [0, 0],
        iconAnchor: [0, 0],
        shadowSize: [0, 0],
        shadowAnchor: [0, 0],
        className: "waypoint-icon",
      },
    }).addTo(mapObj.current);
  }, [gpxState]);

  return (
    <div className="map" id="jam">
      <div id="mapid" ref={mapEl}></div>
      {mapObj.current &&
        waypointsState &&
        renderMarkers(waypointsState, mapObj.current)}
    </div>
  );
};
