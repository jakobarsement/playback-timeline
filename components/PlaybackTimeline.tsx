import { format, hoursToMilliseconds, minutesToMilliseconds } from "date-fns";
import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import React, { useMemo, useState } from "react";
import Item from "./Item";
import Row from "./Row";
import Subrow from "./Subrow";
import TimeAxis from "./TimeAxis";
import type { MarkerDefinition } from "./TimeAxis";
import TimeCursor from "./TimeCursor";

const timeAxisMarkers: MarkerDefinition[] = [
  {
    value: hoursToMilliseconds(24),
    getLabel: (date: Date) => format(date, "E"),
  },
  {
    value: hoursToMilliseconds(2),
    minRangeSize: hoursToMilliseconds(24),
    getLabel: (date: Date) => format(date, "k"),
  },
  {
    value: hoursToMilliseconds(1),
    minRangeSize: hoursToMilliseconds(24),
  },
  {
    value: hoursToMilliseconds(1),
    maxRangeSize: hoursToMilliseconds(24),
    getLabel: (date: Date) => format(date, "k"),
  },
  {
    value: minutesToMilliseconds(30),
    maxRangeSize: hoursToMilliseconds(24),
    minRangeSize: hoursToMilliseconds(12),
  },
  {
    value: minutesToMilliseconds(15),
    maxRangeSize: hoursToMilliseconds(12),
    getLabel: (date: Date) => format(date, "m"),
  },
  {
    value: minutesToMilliseconds(5),
    maxRangeSize: hoursToMilliseconds(6),
    minRangeSize: hoursToMilliseconds(3),
  },
  {
    value: minutesToMilliseconds(5),
    maxRangeSize: hoursToMilliseconds(3),
    getLabel: (date: Date) => format(date, "m"),
  },
  {
    value: minutesToMilliseconds(1),
    maxRangeSize: hoursToMilliseconds(2),
  },
];

interface TimelineProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

function PlaybackTimeline(props: TimelineProps) {
  const { setTimelineRef, style, range } = useTimelineContext();
  const [isPlaying, setIsPlaying] = useState(false);

  const groupedSubrows = useMemo(
    () => groupItemsToSubrows(props.items, range),
    [props.items, range]
  );

  return (
    <div ref={setTimelineRef} style={style}>
      <TimeAxis markers={timeAxisMarkers} />
      <TimeCursor isPlaying={isPlaying} />
      <Row
        id={"row.id"}
        key={1}
        sidebar={
          <div style={{ padding: 5 }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                backgroundColor: "green",
                cursor: "pointer",
                padding: 2,
              }}
            >
              Play
            </button>
          </div>
        }
      >
        <div> XXX</div>
      </Row>
    </div>
  );
}

export default PlaybackTimeline;
