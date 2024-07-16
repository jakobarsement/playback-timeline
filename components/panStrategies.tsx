import { PanEndEvent, UsePanStrategy, useTimelineContext } from "dnd-timeline";
import { useLayoutEffect } from "react";

export const useWheelStrategy: UsePanStrategy = (timelineRef, onPanEnd) => {
  useLayoutEffect(() => {
    const element = timelineRef.current;
    if (!element) return;

    const pointerWheelHandler = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;

      event.preventDefault();

      const isHorizontal = event.shiftKey;

      const panEndEvent: PanEndEvent = {
        clientX: event.clientX,
        clientY: event.clientY,
        deltaX: isHorizontal ? event.deltaX || event.deltaY : 0,
        deltaY: isHorizontal ? 0 : event.deltaY,
      };

      onPanEnd(panEndEvent);
    };

    element.addEventListener("wheel", pointerWheelHandler, { passive: false });

    return () => {
      element.removeEventListener("wheel", pointerWheelHandler);
    };
  }, [onPanEnd, timelineRef]);
};

export const useWheelStrategyAndPlaybackProgression: UsePanStrategy = (
  timelineRef,
  onPanEnd
) => {
  // const {} = useTimelineContext();

  useLayoutEffect(() => {
    const element = timelineRef.current;
    if (!element) return;

    const pointerWheelHandler = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;

      event.preventDefault();

      const isHorizontal = event.shiftKey;

      const panEndEvent: PanEndEvent = {
        clientX: event.clientX,
        clientY: event.clientY,
        deltaX: isHorizontal ? event.deltaX || event.deltaY : 0,
        deltaY: isHorizontal ? 0 : event.deltaY,
      };

      onPanEnd(panEndEvent);
    };

    element.addEventListener("wheel", pointerWheelHandler, { passive: false });

    return () => {
      element.removeEventListener("wheel", pointerWheelHandler);
    };
  }, [onPanEnd, timelineRef]);
};
