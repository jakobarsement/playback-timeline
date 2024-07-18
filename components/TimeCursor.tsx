import React, { memo, useRef, useLayoutEffect } from "react";

import { useTimelineContext } from "dnd-timeline";
import { useZustandStore } from "@/state";

interface TimeCursorProps {
  interval?: number;
  isPlaying: boolean;
}

function TimeCursor(props: TimeCursorProps) {
  const timeCursorRef = useRef<HTMLDivElement>(null);
  const setTimeAtCursor = useZustandStore((state) => state.setTimeAtCursor);
  const timeAtCursorStoreValue = useZustandStore((state) => state.timeAtCursor);
  const { range, direction, sidebarWidth, valueToPixels } =
    useTimelineContext();
  const side = direction === "rtl" ? "right" : "left";

  const isVisible =
    new Date().getTime() > range.start && new Date().getTime() < range.end;

  /**TODOS
   *
   * - Create playback ability
   * - Keep track of timeline viewable range
   * - Adjust timeline viewable range as data plays back
   */

  useLayoutEffect(() => {
    if (!isVisible) return;

    const offsetCursor = () => {
      if (!props.isPlaying) return;
      if (!timeCursorRef.current) return;

      // The center of the timeline using the left border pixel offset
      const centerOfTimelineOffsetTime = (range.end - range.start) / 2;
      const centerOfTimelineOffsetPx = valueToPixels(
        centerOfTimelineOffsetTime
      );

      // console.log(1, timeAtCursorStoreValue);

      // The time beneath the cursor
      const timeAtCursor = new Date(range.start + centerOfTimelineOffsetTime);
      setTimeAtCursor(timeAtCursor);

      // console.log(2, timeAtCursorStoreValue);
      // The cursor position's offset from the rightmost edge of the "sidebar"
      const sideDelta = sidebarWidth + centerOfTimelineOffsetPx;

      // console.log({ timeAtCursor, rangeStart: new Date(range.start) });
      timeCursorRef.current.style[side] = `${sideDelta}px`;
    };

    offsetCursor();

    const interval = setInterval(offsetCursor, props.interval || 100000);

    return () => {
      clearInterval(interval);
    };
  }, [
    side,
    sidebarWidth,
    props.interval,
    range.start,
    range.end,
    valueToPixels,
    isVisible,
    props.isPlaying,
    setTimeAtCursor,
  ]);

  if (!isVisible) return null;

  return (
    <div
      ref={timeCursorRef}
      style={{
        height: "100%",
        width: "3px",
        zIndex: 3,
        backgroundColor: "green",
        position: "absolute",
      }}
    />
  );
}

export default memo(TimeCursor);
