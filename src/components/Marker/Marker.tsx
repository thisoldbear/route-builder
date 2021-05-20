import React, { useRef, useEffect, useContext } from "react";
import Leaflet from "leaflet";
import ReactDOM from "react-dom";
import { Context, Waypoint, StateActionType } from "../../context/Context";

import "./Marker.scss";

export interface MarkerProps extends Waypoint {
  map: Leaflet.Map;
}

export const Marker: React.FC<MarkerProps> = ({
  id,
  lat,
  lng,
  number,
  map,
}) => {
  const marker = useRef<Leaflet.Marker | null>(null);

  const { dispatch } = useContext(Context);

  useEffect(() => {
    if (lat && lng && number) {
      const emptyDiv = document.createElement("div");

      // Add a divIcon to render in the marker
      const icon = Leaflet.divIcon({
        iconUrl: "marker-icon.png",
        iconSize: [22, 22],
        html: `<div class="div-icon"><span class="div-icon__inner">${number}</span></div>`,
      });

      // Add the marker to the map
      marker.current = Leaflet.marker([lat, lng], { icon: icon })
        .addTo(map)
        .bindPopup(emptyDiv);

      // Render a React button inide the popup
      ReactDOM.render(
        <>
          <button
            className="marker__button"
            onClick={() => {
              dispatch({
                type: StateActionType.RemoveWaypoint,
                payload: {
                  id,
                },
              });
            }}
          >
            Remove Waypoint
          </button>
        </>,
        emptyDiv
      );
    }

    // Cleanup
    return () => {
      map.removeLayer(marker.current);
    };
  }, [id, lat, lng, map, number, dispatch]);

  return null;
};
