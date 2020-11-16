import React, { createContext, useReducer, useEffect, useState } from "react";
import { getGpx } from "../services/getGpx";

export interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  number: number;
}

export interface WaypointStateItem {
  [id: string]: Waypoint
}

export interface WaypointsState {
  waypointsState: WaypointStateItem;
  setWaypointsState: React.Dispatch<React.SetStateAction<Waypoint>>;
}

export type Gpx = string | null;

export interface GpxState {
  gpxState: Gpx;
  setGpxState: React.Dispatch<React.SetStateAction<Gpx>>;
}

interface ContextProps {
  waypointsState: WaypointsState;
  waypointsDispatch: React.Dispatch<WaypointsAction>;
  gpxState: Gpx;
}

export enum WaypointsActionType {
  Add = "ADD",
  Remove = "REMOVE",
  Reorder = "REORDER",
}

export interface WaypointsAction {
  type: WaypointsActionType;
  payload: any;
}

interface ContextProviderProps {
  children: React.ReactNode;
}

const Context = createContext<Partial<ContextProps>>({});

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const initialWaypointsState = {};

  const waypointsReducer = (currentState: WaypointStateItem, action: WaypointsAction) => {
    switch (action.type) {
      case WaypointsActionType.Add:
        // Add the item to state
        const stateWithAdded = {
          ...currentState,
          [`${action.payload.lat}${action.payload.lng}`]: {
            lat: action.payload.lat,
            lng: action.payload.lng,
            number: Object.entries(currentState).length + 1,
          },
        };

        return stateWithAdded;

      case WaypointsActionType.Remove:
        // Removes the waypoint from state using the id, in a slightly convoluted way :-\
        const stateWithRemoved = Object.entries(currentState).reduce(
          (acc, [currId, currVal]) => {
            if (currId !== action.payload.id) {
              return {
                ...acc,
                [currId]: {
                  ...(currVal as {}),
                },
              };
            }
            return acc;
          },
          {}
        );

        // Iterate over the new state (again :sad:) to update the number
        // In the real world, we likely can't rely on this alone as the order could shift :-)
        return Object.entries(stateWithRemoved).reduce(
          (acc, [currId, currVal], index) => {
            if (currId !== action.payload.id) {
              return {
                ...acc,
                [currId]: {
                  ...(currVal as {}),
                  number: index + 1,
                },
              };
            }
            return acc;
          },
          {}
        );

      case WaypointsActionType.Reorder:
        // Takes the array of ids passed in and returns a new state object
        const newState = action.payload.reduce((acc, curr) => {
          return {
            ...acc,
            [curr]: {
              ...(currentState[curr] as {}),
              number: Object.keys(acc).length + 1,
            },
          };
        }, {});

        return newState;

      default:
        throw new Error();
    }
  };

  const [waypointsState, waypointsDispatch] = useReducer(
    waypointsReducer,
    initialWaypointsState
  );

  const [gpxState, setGpxState] = useState<Gpx>(null);

  useEffect(() => {
    const fetchGpx = async () => {
      const gpx = await getGpx(waypointsState);
      setGpxState(gpx);
    };

    if (waypointsState && Object.keys(waypointsState).length >= 2) {
      fetchGpx();
    } else if (Object.keys(waypointsState).length <= 1) {
      setGpxState(null);
    }
  }, [waypointsState]);

  return (
    <Context.Provider
      value={{
        waypointsState,
        waypointsDispatch,
        gpxState,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
