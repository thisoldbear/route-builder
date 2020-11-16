import React, { useContext, useState } from "react";
import "./WaypointsList.scss";
import {
  Context,
  WaypointsState,
  WaypointsActionType,
} from "../../context/Context";

export const WaypointsList: React.FC = () => {
  const { waypointsState, waypointsDispatch } = useContext(Context);
  const [hoverTargetId, setHoverTargetId] = useState(null);
  const [dragItemId, setDragItemId] = useState(null);

  const renderWaypointsList = (waypoints: WaypointsState) =>
    Object.entries(waypoints).map((waypoint) => {
      const [id, value] = waypoint;
      return (
        <li
          key={id}
          draggable="true"
          className={`waypoints-list__item ${
            hoverTargetId === id && "waypoints-list__item--target"
          } ${dragItemId === id && "waypoints-list__item--dragging"}`}
          data-id={id}
          onDragStart={(e) => {
            e.dataTransfer.setData("id", id);
            setDragItemId(id);
          }}
          onDragOver={(e) => {
            setHoverTargetId(id);
          }}
        >
          <span className="waypoints-list__item-icon">&#8801;</span>
          <span className="waypoints-list__item-label">
            Waypoint #{value.number}
          </span>
          <button
            className="waypoints-list__item-remove"
            onClick={() => {
              waypointsDispatch({
                type: WaypointsActionType.Remove,
                payload: {
                  id,
                },
              });
            }}
          >
            🗑
          </button>
        </li>
      );
    });

  // https://dev.to/jalal246/moving-element-in-an-array-from-index-to-another-464b
  const move = (input, from, to) => {
    let numberOfDeletedElm = 1;

    const elm = input.splice(from, numberOfDeletedElm)[0];

    numberOfDeletedElm = 0;

    input.splice(to, numberOfDeletedElm, elm);

    return input;
  };

  return (
    <ul
      className="waypoints-list"
      onDrop={(e) => {
        // Things got a little unpredictable here with trying to use `hoverTargetId` and `dragItemId`
        // from react state. I would go back and refactor this.
        const movedItemId = e.dataTransfer.getData("id");
        const targetItem = e.target as HTMLElement;
        const targetItemId = targetItem.dataset.id;
        const waypointsStateIds = Object.keys(waypointsState);
        const movedItemOriginalIndex = waypointsStateIds.indexOf(movedItemId);
        const targetItemOriginalIndex = waypointsStateIds.indexOf(targetItemId);

        waypointsDispatch({
          type: WaypointsActionType.Reorder,
          payload: move(
            [...waypointsStateIds],
            movedItemOriginalIndex,
            targetItemOriginalIndex
          ),
        });
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragEnd={(e) => {
        setHoverTargetId(null);
        setDragItemId(null);
      }}
    >
      {Object.keys(waypointsState).length > 0 ? (
        renderWaypointsList(waypointsState)
      ) : (
        <p>Click on the map to set a start point</p>
      )}
    </ul>
  );
};
