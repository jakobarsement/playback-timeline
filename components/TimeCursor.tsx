import React, { memo, useRef, useLayoutEffect } from "react";

import { useTimelineContext } from "dnd-timeline";

interface TimeCursorProps {
  interval?: number;
  isPlaying: boolean;
}

function TimeCursor(props: TimeCursorProps) {
  const timeCursorRef = useRef<HTMLDivElement>(null);
  const {
    range,
    direction,
    sidebarWidth,
    valueToPixels,
    pixelsToValue,
    timelineRef,
  } = useTimelineContext();
  const side = direction === "rtl" ? "right" : "left";

  const isVisible =
    new Date().getTime() > range.start && new Date().getTime() < range.end;

  useLayoutEffect(() => {
    if (!isVisible) return;

    const offsetCursor = () => {
      if (!props.isPlaying) return;
      if (!timeCursorRef.current) return;

      // The center of the timeline using the left border pixel offset
      const centerOfTimeline = (range.end - range.start) / 2;
      const centerOfTimelineOffsetPx = valueToPixels(centerOfTimeline);

      // The time beneath the cursor
      const timeAtCursor = new Date(range.start + centerOfTimeline);

      // The cursor position's offset from the rightmost edge of the "sidebar"
      const sideDelta = sidebarWidth + centerOfTimelineOffsetPx;

      console.log({ timeAtCursor });
      timeCursorRef.current.style[side] = `${sideDelta}px`;
    };

    offsetCursor();

    const interval = setInterval(offsetCursor, props.interval || 100000000);

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
