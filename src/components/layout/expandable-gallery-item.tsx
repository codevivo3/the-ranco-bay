"use client";

import type {KeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode} from "react";
import {useEffect, useRef} from "react";

import {useExpandableGallery} from "@/components/layout/expandable-gallery-group";

type ExpandableGalleryItemProps = {
  children: ReactNode;
  dialogContent: ReactNode;
  dialogLabel: string;
  itemId: string;
};

const DRAG_THRESHOLD = 10;

export function ExpandableGalleryItem({
  children,
  dialogContent,
  dialogLabel,
  itemId,
}: ExpandableGalleryItemProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{x: number; y: number} | null>(null);
  const dragged = useRef(false);
  const gallery = useExpandableGallery();

  useEffect(() => {
    return gallery.registerItem(itemId, {dialogContent, dialogLabel});
  }, [dialogContent, dialogLabel, gallery, itemId]);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    pointerStart.current = {x: event.clientX, y: event.clientY};
    dragged.current = false;
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointerStart.current) {
      return;
    }

    const distance = Math.hypot(
      event.clientX - pointerStart.current.x,
      event.clientY - pointerStart.current.y,
    );

    if (distance > DRAG_THRESHOLD) {
      dragged.current = true;
    }
  }

  function handleClick() {
    pointerStart.current = null;

    if (dragged.current) {
      dragged.current = false;
      return;
    }

    gallery.openItem(itemId, triggerRef.current);
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    gallery.openItem(itemId, triggerRef.current);
  }

  return (
    <div
      ref={triggerRef}
      data-expandable-gallery-item={itemId}
      aria-haspopup="dialog"
      aria-label={dialogLabel}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleTriggerKeyDown}
      onPointerCancel={() => {
        pointerStart.current = null;
        dragged.current = true;
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      className="group h-full w-full cursor-zoom-in touch-pan-x touch-pan-y overflow-hidden focus-visible:outline-offset-[-2px]"
    >
      {children}
    </div>
  );
}
