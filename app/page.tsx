"use client";
import { endOfDay, startOfDay } from "date-fns";
import type {
  ItemDefinition,
  PanEndEvent,
  Range,
  ResizeEndEvent,
  RowDefinition,
  UsePanStrategy,
} from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import React, { useCallback, useLayoutEffect, useState } from "react";
import PlaybackTimeline from "@/components/PlaybackTimeline";

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

  const useWheelStrategyAndPlaybackProgression: UsePanStrategy = (
    timelineRef,
    onPanEnd
  ) => {
    useLayoutEffect(() => {
      const element = timelineRef.current;
      if (!element) return;

      const pointerWheelHandler = (event: WheelEvent) => {
        if (!event.ctrlKey && !event.metaKey) return;

        event.preventDefault();

        const isHorizontal = event.shiftKey;

        console.table({
          clientX: event.clientX,
          clientY: event.clientY,
          deltaX: isHorizontal ? event.deltaX || event.deltaY : 0,
          deltaY: isHorizontal ? 0 : event.deltaY,
        });
        const panEndEvent: PanEndEvent = {
          clientX: event.clientX,
          clientY: event.clientY,
          deltaX: isHorizontal ? event.deltaX || event.deltaY : 0,
          deltaY: isHorizontal ? 0 : event.deltaY,
        };

        onPanEnd(panEndEvent);
      };

      element.addEventListener("wheel", pointerWheelHandler, {
        passive: false,
      });

      return () => {
        element.removeEventListener("wheel", pointerWheelHandler);
      };
    }, [onPanEnd, timelineRef]);
  };

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
