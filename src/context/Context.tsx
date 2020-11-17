import React, { createContext, useReducer, useEffect, useRef } from "react";
import { getGpx } from "../services/getGpx";
import { updateWaypointsToNearestCoords } from "../utils/updateWaypointsToNearestCoords";
export interface Waypoint {
  id?: string;
  lat: number;
  lng: number;
  number: number;
}

export interface WaypointStateItem {
  [id: string]: Waypoint;
}

export type Gpx = string | null;

export interface State {
  waypoints: WaypointStateItem;
  gpx: Gpx;
  timestamp: number;
}

interface ContextProps {
  state: State;
  dispatch: React.Dispatch<StateAction>;
}

export enum StateActionType {
  AddWaypoint = "ADD_WAYPOINT",
  RemoveWaypoint = "REMOVE_WAYPOINT",
  ReorderWaypoint = "REORDER_WAYPOINT",
  UpdateWaypoint = "UPDATE_WAYPOINT",
  UpdateGpx = "UPDATE_GPX",
}

export interface StateAction {
  type: StateActionType;
  payload: any;
}

interface ContextProviderProps {
  children: React.ReactNode;
}



const Context = createContext<Partial<ContextProps>>({});

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const initialState = {
    waypoints: {},
    gpx: null,
    timestamp: null,
  };

  const timestamp = useRef(Date.now());

  const reducer = (currentState: State, action: StateAction) => {
    switch (action.type) {
      case StateActionType.AddWaypoint:
        // Add the item to state
        const stateWithAdded = {
          ...currentState,
          timestamp: Date.now(),
          waypoints: {
            ...currentState.waypoints,
            [`${action.payload.lat}${action.payload.lng}`]: {
              lat: action.payload.lat,
              lng: action.payload.lng,
              number: Object.entries(currentState.waypoints).length + 1,
            },
          },
        };

        return stateWithAdded;

      case StateActionType.RemoveWaypoint:
        // Removes the waypoint from state using the id, in a slightly convoluted way :-\
        const waypointsWithRemoved = Object.entries(
          currentState.waypoints
        ).reduce((acc, [currId, currVal]) => {
          if (currId !== action.payload.id) {
            return {
              ...acc,
              [currId]: {
                ...(currVal as {}),
              },
            };
          }
          return acc;
        }, {});

        // Iterate over the new state (again :sad:) to update the number
        // In the real world, we likely can't rely on this alone as the order could shift :-)
        const waypointsWithNumbers = Object.entries(
          waypointsWithRemoved
        ).reduce((acc, [currId, currVal], index) => {
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
        }, {});

        return {
          ...currentState,
          timestamp: Date.now(),
          waypoints: {
            ...waypointsWithNumbers,
          },
        };

      case StateActionType.ReorderWaypoint:
        // Takes the array of ids passed in and returns a new state object
        const newReorderedWaypoints = action.payload.reduce((acc, curr) => {
          return {
            ...acc,
            [curr]: {
              ...(currentState.waypoints[curr] as {}),
              number: Object.keys(acc).length + 1,
            },
          };
        }, {});

        return {
          ...currentState,
          timestamp: Date.now(),
          waypoints: {
            ...newReorderedWaypoints,
          },
        };

      case StateActionType.UpdateGpx:
        const updatedWaypoints = updateWaypointsToNearestCoords(
          action.payload,
          currentState.waypoints
        );

        if (updatedWaypoints) {
          return {
            ...currentState,
            waypoints: {
              ...updatedWaypoints,
            },
            gpx: action.payload,
          };
        }

        return {
          ...currentState,
          gpx: action.payload,
        };

      case StateActionType.UpdateWaypoint:
        return {
          ...currentState,
        };

      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchGpx = async () => {
      const gpx = await getGpx(state.waypoints);
      dispatch({
        type: StateActionType.UpdateGpx,
        payload: gpx,
      });
    };

    if (state.timestamp !== timestamp.current) {
      fetchGpx();
    }
  }, [state.timestamp]); // TODO: Fix deps

  return (
    <Context.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
