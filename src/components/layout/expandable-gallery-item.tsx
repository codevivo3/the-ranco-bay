"use client";

import type {
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";

type ExpandableGalleryItemProps = {
  children: ReactNode;
  closeLabel: string;
  dialogContent: ReactNode;
  dialogLabel: string;
};

const DRAG_THRESHOLD = 10;

export function ExpandableGalleryItem({
  children,
  closeLabel,
  dialogContent,
  dialogLabel,
}: ExpandableGalleryItemProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pointerStart = useRef<{x: number; y: number} | null>(null);
  const dragged = useRef(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => {
      closeRef.current?.focus();
    });

    function handleDialogKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleDialogKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleDialogKeyDown);
      trigger?.focus({preventScroll: true});
    };
  }, [open]);

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

    setOpen(true);
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    setOpen(true);
  }

  return (
    <>
      <div
        ref={triggerRef}
        aria-haspopup='dialog'
        aria-label={dialogLabel}
        role='button'
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleTriggerKeyDown}
        onPointerCancel={() => {
          pointerStart.current = null;
          dragged.current = true;
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className='group h-full w-full cursor-zoom-in touch-pan-x touch-pan-y overflow-hidden focus-visible:outline-offset-[-2px]'
      >
        {children}
      </div>

      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              className='fixed inset-0 z-[100] flex items-center justify-center bg-[color-mix(in_srgb,var(--trb-lake)_88%,transparent)] p-4 backdrop-blur-sm sm:p-8'
              onPointerDown={(event) => {
                if (event.target === event.currentTarget) {
                  setOpen(false);
                }
              }}
            >
              <div
                ref={dialogRef}
                role='dialog'
                aria-label={dialogLabel}
                aria-modal='true'
                className='relative max-h-[92svh] max-w-[94vw] overflow-y-auto overscroll-contain text-[var(--trb-sand)]'
              >
                <button
                  ref={closeRef}
                  type='button'
                  aria-label={closeLabel}
                  onClick={() => setOpen(false)}
                  className='absolute right-2 top-2 z-20 flex size-11 items-center justify-center border border-[color-mix(in_srgb,var(--trb-sand)_32%,transparent)] bg-[color-mix(in_srgb,var(--trb-lake)_68%,transparent)] font-display text-2xl leading-none text-[var(--trb-sand)] backdrop-blur-sm transition-colors hover:bg-[color-mix(in_srgb,var(--trb-lake)_82%,transparent)] focus-visible:outline-offset-2 motion-reduce:transition-none'
                >
                  <span aria-hidden='true'>×</span>
                </button>
                {dialogContent}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
