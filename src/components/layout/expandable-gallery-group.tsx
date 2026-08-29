"use client";

import type {ReactNode} from "react";
import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {ChevronLeft, ChevronRight, X} from "lucide-react";

type RegisteredItem = {
  dialogContent: ReactNode;
  dialogLabel: string;
};

type ActiveItem = RegisteredItem & {
  id: string;
  itemIds: string[];
};

type GalleryContextValue = {
  openItem: (itemId: string, trigger: HTMLElement | null) => void;
  registerItem: (itemId: string, item: RegisteredItem) => () => void;
};

type ExpandableGalleryGroupProps = {
  children: ReactNode;
  className?: string;
  closeLabel: string;
  nextLabel: string;
  previousLabel: string;
};

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function useExpandableGallery() {
  const value = useContext(GalleryContext);

  if (!value) {
    throw new Error("ExpandableGalleryItem must be inside ExpandableGalleryGroup");
  }

  return value;
}

export function ExpandableGalleryGroup({
  children,
  className = "",
  closeLabel,
  nextLabel,
  previousLabel,
}: ExpandableGalleryGroupProps) {
  const [activeItem, setActiveItem] = useState<ActiveItem | null>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const originRef = useRef<HTMLElement | null>(null);
  const registryRef = useRef(new Map<string, RegisteredItem>());
  const activeItemRef = useRef<ActiveItem | null>(null);

  const registerItem = useCallback((itemId: string, item: RegisteredItem) => {
    registryRef.current.set(itemId, item);
    return () => registryRef.current.delete(itemId);
  }, []);

  const openItem = useCallback((itemId: string, trigger: HTMLElement | null) => {
    const item = registryRef.current.get(itemId);

    if (!item) return;

    const itemIds = Array.from(
      groupRef.current?.querySelectorAll<HTMLElement>(
        "[data-expandable-gallery-item]",
      ) ?? [],
    ).map((element) => element.dataset.expandableGalleryItem ?? "");
    const nextActiveItem = {id: itemId, itemIds, ...item};
    originRef.current = trigger;
    activeItemRef.current = nextActiveItem;
    setActiveItem(nextActiveItem);
  }, []);

  const close = useCallback(() => {
    activeItemRef.current = null;
    setActiveItem(null);
  }, []);

  const activeIndex = activeItem
    ? activeItem.itemIds.indexOf(activeItem.id)
    : -1;
  const isOpen = activeItem !== null;

  const navigate = useCallback((direction: -1 | 1) => {
    const current = activeItemRef.current;

    if (!current) return;

    const currentIndex = current.itemIds.indexOf(current.id);
    const nextId = current.itemIds[currentIndex + direction];
    const nextItem = nextId ? registryRef.current.get(nextId) : undefined;

    if (!nextId || !nextItem) return;

    const nextActiveItem = {
      id: nextId,
      itemIds: current.itemIds,
      ...nextItem,
    };
    activeItemRef.current = nextActiveItem;
    setActiveItem(nextActiveItem);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => closeRef.current?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigate(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        navigate(1);
      } else if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
          ),
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!first || !last) {
          event.preventDefault();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      originRef.current?.focus({preventScroll: true});
    };
  }, [isOpen, close, navigate]);

  const contextValue = useMemo(
    () => ({openItem, registerItem}),
    [openItem, registerItem],
  );
  const showNavigation = (activeItem?.itemIds.length ?? 0) > 1;

  return (
    <GalleryContext.Provider value={contextValue}>
      <div ref={groupRef} className={`h-full min-w-0 ${className}`}>
        {children}
      </div>
      {activeItem && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-[color-mix(in_srgb,var(--trb-lake)_88%,transparent)] p-4 backdrop-blur-sm sm:p-8"
              onPointerDown={(event) => {
                if (event.target === event.currentTarget) close();
              }}
            >
              <div
                ref={dialogRef}
                role="dialog"
                aria-label={activeItem.dialogLabel}
                aria-modal="true"
                className="w-[min(96vw,96rem)] max-w-full text-[var(--trb-sand)]"
              >
                <div className="flex h-12 items-start justify-end sm:h-14">
                  <button
                    ref={closeRef}
                    type="button"
                    aria-label={closeLabel}
                    onClick={close}
                    className="flex size-11 items-center justify-center text-[var(--trb-sand)] opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-offset-2 motion-reduce:transition-none"
                  >
                    <X aria-hidden="true" size={24} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center sm:grid-cols-[3.5rem_minmax(0,1fr)_3.5rem]">
                  <div className="flex justify-start">
                    {showNavigation && activeIndex > 0 ? (
                      <button
                        type="button"
                        aria-label={previousLabel}
                        onClick={() => navigate(-1)}
                        className="group flex size-11 items-center justify-center text-[var(--trb-sand)] opacity-65 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-offset-2 motion-reduce:transition-none"
                      >
                        <ChevronLeft
                          aria-hidden="true"
                          className="transition-transform group-hover:-translate-x-1 motion-reduce:transition-none motion-reduce:transform-none"
                          size={24}
                          strokeWidth={1.5}
                        />
                      </button>
                    ) : null}
                  </div>
                  <div className="max-h-[calc(94svh-3.5rem)] min-w-0 overflow-y-auto overscroll-contain">
                    {activeItem.dialogContent}
                  </div>
                  <div className="flex justify-end">
                    {showNavigation &&
                    activeIndex >= 0 &&
                    activeIndex < activeItem.itemIds.length - 1 ? (
                      <button
                        type="button"
                        aria-label={nextLabel}
                        onClick={() => navigate(1)}
                        className="group flex size-11 items-center justify-center text-[var(--trb-sand)] opacity-65 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-offset-2 motion-reduce:transition-none"
                      >
                        <ChevronRight
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none"
                          size={24}
                          strokeWidth={1.5}
                        />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </GalleryContext.Provider>
  );
}
