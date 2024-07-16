"use client";
import "../components/index.css";
import { endOfDay, startOfDay } from "date-fns";
import type {
  ItemDefinition,
  Range,
  ResizeEndEvent,
  RowDefinition,
} from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import React, { useCallback, useState } from "react";
import PlaybackTimeline from "@/components/PlaybackTimeline";
import { useWheelStrategyAndPlaybackProgression } from "@/components/panStrategies";

const DEFAULT_RANGE: Range = {
  start: startOfDay(new Date()).getTime(),
  end: endOfDay(new Date()).getTime(),
};

function App() {
  const [range, setRange] = useState(DEFAULT_RANGE);

  const [rows] = useState<RowDefinition[]>([{ id: "123" }]);
  const [items, setItems] = useState<ItemDefinition[]>([
    { id: "123", span: { end: 0, start: 1 }, rowId: "123" },
  ]);

  const onResizeEnd = useCallback((event: ResizeEndEvent) => {
    const updatedSpan =
      event.active.data.current.getSpanFromResizeEvent?.(event);

    if (!updatedSpan) return;

    const activeItemId = event.active.id;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== activeItemId) return item;

        return {
          ...item,
          span: updatedSpan,
        };
      })
    );
  }, []);

  return (
    <TimelineContext
      range={range}
      onResizeEnd={onResizeEnd}
      onRangeChanged={setRange}
      usePanStrategy={useWheelStrategyAndPlaybackProgression}
    >
      <PlaybackTimeline items={items} rows={rows} />
    </TimelineContext>
  );
}

export default App;
