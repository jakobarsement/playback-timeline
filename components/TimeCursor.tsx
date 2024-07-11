import React, { memo, useRef, useLayoutEffect } from "react";

import { useTimelineContext } from "dnd-timeline";

interface TimeCursorProps {
  interval?: number;
  isPlaying: boolean;
}

function TimeCursor(props: TimeCursorProps) {
  const timeCursorRef = useRef<HTMLDivElement>(null);
  const { range, direction, sidebarWidth, valueToPixels } =
    useTimelineContext();
  const side = direction === "rtl" ? "right" : "left";

  const isVisible =
    new Date().getTime() > range.start && new Date().getTime() < range.end;

  useLayoutEffect(() => {
    if (!isVisible) return;

    const offsetCursor = () => {
      if (!props.isPlaying) return;

      if (!timeCursorRef.current) return;

      const timeAtCursor = new Date().getTime(); // Change to cursor selected time when timeline is clicked

      const timeDelta = timeAtCursor - range.start;
      const timeDeltaInPixels = valueToPixels(timeDelta);

      // This is the cursor position (the offset from the rightmost edge of the "sidebar")
      const sideDelta = sidebarWidth + timeDeltaInPixels;

      console.log({ sidebarWidth, timeDeltaInPixels, sideDelta });
      console.log("time at cursor: ", new Date(timeAtCursor).toLocaleString()); // Using local time for dev; change to zulu in future
      console.log("isplaying", props.isPlaying);
      timeCursorRef.current.style[side] = `${sideDelta}px`;
    };

    offsetCursor();

    const interval = setInterval(offsetCursor, props.interval || 1000);

    return () => {
      clearInterval(interval);
    };
  }, [
    side,
    sidebarWidth,
    props.interval,
    range.start,
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
