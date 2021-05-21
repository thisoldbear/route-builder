import gpxParser from "gpxparser";
import { WaypointStateItem } from "../context/Context";
import { diffPropertyCompare, numberDiff } from "./utils";

export const updateWaypointsToNearestCoords = (
  gpx: string,
  waypoints: WaypointStateItem
) => {
  if (gpx == null) {
    return;
  }

  const parser = new gpxParser();

  parser.parse(gpx);

  const pointsArray = parser.tracks[0].points;

  if (!pointsArray) {
    return;
  }

  // Loop over the waypoints to update their lat/lng to better match the GPX data
  return Object.entries(waypoints).reduce((acc: any, curr: any, index) => {
    const [id, value] = curr;

    // Update the first waypoint with the first point in the GPX
    if (index === 0) {
      return {
        ...acc,
        [id]: {
          ...(value as {}),
          lat: pointsArray[0].lat,
          lng: pointsArray[0].lon,
        },
      };
    }

    // Update the last waypoint with the first point in the GPX
    if (index === Object.keys(waypoints).length - 1) {
      return {
        ...acc,
        [id]: {
          ...(value as {}),
          lat: pointsArray[pointsArray.length - 1].lat,
          lng: pointsArray[pointsArray.length - 1].lon,
        },
      };
    }

    // Loop over the GPX points and return their coords and a difference value
    const closestPoint = pointsArray
      .reduce((acc: any, curr: any) => {
        return [
          ...acc,
          {
            lat: curr.lat,
            lng: curr.lon,
            diff:
              numberDiff(value.lat, curr.lat) + numberDiff(value.lat, curr.lat),
          },
        ];
      }, [])
      .sort(diffPropertyCompare)[0];

    return {
      ...acc,
      [id]: {
        ...(value as {}),
        lat: closestPoint.lat,
        lng: closestPoint.lng,
      },
    };
  }, {});
};
