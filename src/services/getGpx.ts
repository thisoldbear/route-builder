import axios from "axios";

import { WaypointStateItem } from "../context/Context";

const createCoordinatesQueryString = (waypoints: WaypointStateItem) => {
  return Object.entries(waypoints)
    .reduce((acc, curr) => {
      const [, val] = curr;
      const string = `point=${val.lat},${val.lng}`;
      return [...acc, string];
    }, [])
    .join("&");
};

export const getGpx = (waypoints: WaypointStateItem) => {
  if (Object.entries(waypoints).length <= 1) {
    return null;
  }

  const routeQs = createCoordinatesQueryString(waypoints);

  return (
    axios
      // .get('data.gpx') // Dummy data to use in dev mode to not hit the api as much
      .get(
        `https://graphhopper.com/api/1/route?${routeQs}&vehicle=foot&locale=en&key=${process.env.REACT_APP_GRAPH_API_KEY}&gpx.route=false&type=gpx`
      )
      .then((response) => {
        // handle success
        return response.data;
      })
      .catch((error) => {
        // handle error
        console.log(error);
      })
  );
};
