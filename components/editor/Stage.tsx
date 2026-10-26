"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Moveable from "react-moveable";
import Selecto from "react-selecto";
import { elementStyle, stageStyle } from "@/components/canvas/CanvasView";
import { STAGE, type CanvasElement, type CanvasSlide } from "@/lib/canvas/model";

type StageProps = {
  slide: CanvasSlide;
  selected: string[];
  onSelect: (ids: string[]) => void;
  /** Commit geometry or content changes for some elements. */
  onChange: (changes: Record<string, Partial<CanvasElement>>) => void;
};

const SNAP_DIRECTIONS = { top: true, left: true, bottom: true, right: true, center: true, middle: true };

/** Resets the inline geometry written during a gesture back to the model. */
function resetStyle(target: HTMLElement | SVGElement, element: CanvasElement | undefined) {
  if (!element || !(target instanceof HTMLElement)) return;
  const style = elementStyle(element);
  target.style.left = String(style.left);
  target.style.top = String(style.top);
  target.style.width = String(style.width);
  target.style.height = String(style.height);
  target.style.transform = style.transform ? String(style.transform) : "";
}

export function Stage({ slide, selected, onSelect, onChange }: StageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<Moveable>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [editing, setEditing] = useState<string | null>(null);

  // Track the on-screen stage size (scale between screen px and logical units).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(() => setSize({ width: stage.clientWidth, height: stage.clientHeight }));
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // Entering text editing: focus the box and select its text so typing replaces it.
  useEffect(() => {
    if (!editing) return;
    const element = stageRef.current?.querySelector<HTMLElement>(`[data-id="${editing}"]`);
    if (!element) return;
    element.focus();
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, [editing]);

  const scale = size.width / STAGE.width || 1;
  const byId = useMemo(() => new Map(slide.elements.map((element) => [element.id, element])), [slide.elements]);

  // Moveable resolves CSS selectors itself, after render.
  const movable = selected.filter((id) => byId.has(id) && !byId.get(id)?.locked);
  const targets = movable.map((id) => `.editor-stage [data-id="${id}"]`);
  const guidelines = slide.elements
    .filter((element) => !selected.includes(element.id))
    .map((element) => `.editor-stage [data-id="${element.id}"]`);

  // Keep the frame in sync after model changes (e.g. inspector edits).
  useEffect(() => {
    const frame = requestAnimationFrame(() => moveableRef.current?.updateRect());
    return () => cancelAnimationFrame(frame);
  }, [slide, selected, size]);

  const toLogical = (value: number) => Math.round(value / scale);
  const idOf = (target: HTMLElement | SVGElement) => (target as HTMLElement).dataset.id ?? "";

  return (
    <div ref={frameRef} className="editor-frame">
      <div
        ref={stageRef}
        className="editor-stage"
        style={stageStyle(slide)}
        onDoubleClick={(event) => {
          const target = (event.target as HTMLElement).closest<HTMLElement>(".editor-el");
          if (target && byId.get(target.dataset.id ?? "")?.type === "text") setEditing(target.dataset.id ?? null);
        }}
      >
        {slide.elements.map((element) => (
          <div
            key={element.id}
            data-id={element.id}
            data-type={element.type}
            className="canvas-el editor-el"
            data-locked={element.locked || undefined}
            style={elementStyle(element)}
            contentEditable={editing === element.id}
            suppressContentEditableWarning
            onBlur={(event) => {
              if (editing !== element.id) return;
              setEditing(null);
              const text = event.currentTarget.innerText;
              if (text !== element.text) onChange({ [element.id]: { text } });
            }}
          >
            {element.type === "text" ? element.text : null}
          </div>
        ))}
      </div>

      <Moveable
        ref={moveableRef}
        target={editing ? [] : targets}
        draggable
        resizable={movable.length === 1}
        rotatable={movable.length === 1}
        throttleRotate={1}
        snappable
        snapThreshold={6}
        isDisplaySnapDigit
        snapDirections={SNAP_DIRECTIONS}
        elementSnapDirections={SNAP_DIRECTIONS}
        elementGuidelines={guidelines}
        verticalGuidelines={[0, size.width / 2, size.width]}
        horizontalGuidelines={[0, size.height / 2, size.height]}
        onDrag={(event) => {
          event.target.style.left = `${event.left}px`;
          event.target.style.top = `${event.top}px`;
        }}
        onDragEnd={(event) => {
          const last = event.lastEvent;
          const id = idOf(event.target);
          if (!last) return;
          onChange({ [id]: { x: toLogical(last.left), y: toLogical(last.top) } });
        }}
        onDragGroup={(event) => {
          event.events.forEach((item) => {
            item.target.style.left = `${item.left}px`;
            item.target.style.top = `${item.top}px`;
          });
        }}
        onDragGroupEnd={(event) => {
          const changes: Record<string, Partial<CanvasElement>> = {};
          event.events.forEach((item) => {
            if (item.lastEvent) changes[idOf(item.target)] = { x: toLogical(item.lastEvent.left), y: toLogical(item.lastEvent.top) };
          });
          if (Object.keys(changes).length) onChange(changes);
        }}
        onResize={(event) => {
          event.target.style.width = `${event.width}px`;
          event.target.style.height = `${event.height}px`;
          event.target.style.left = `${event.drag.left}px`;
          event.target.style.top = `${event.drag.top}px`;
        }}
        onResizeEnd={(event) => {
          const last = event.lastEvent;
          if (!last) return;
          onChange({
            [idOf(event.target)]: {
              w: Math.max(4, toLogical(last.width)),
              h: Math.max(2, toLogical(last.height)),
              x: toLogical(last.drag.left),
              y: toLogical(last.drag.top),
            },
          });
        }}
        onRotate={(event) => {
          event.target.style.transform = `rotate(${event.rotation}deg)`;
        }}
        onRotateEnd={(event) => {
          const last = event.lastEvent;
          if (!last) return;
          const rotation = Math.round((((last.rotation % 360) + 540) % 360) - 180);
          onChange({ [idOf(event.target)]: { rotation } });
        }}
        onRender={() => undefined}
        onRenderEnd={(event) => resetStyle(event.target, byId.get(idOf(event.target)))}
        onRenderGroupEnd={(event) => event.targets.forEach((target) => resetStyle(target, byId.get(idOf(target))))}
      />

      <Selecto
        dragContainer=".editor-frame"
        selectableTargets={[".editor-stage .editor-el:not([data-locked])"]}
        hitRate={0}
        selectByClick
        selectFromInside={false}
        toggleContinueSelect={["shift"]}
        onDragStart={(event) => {
          const target = event.inputEvent.target as HTMLElement;
          if (editing) {
            event.stop();
            return;
          }
          if (
            moveableRef.current?.isMoveableElement(target) ||
            Boolean(target.closest(".editor-el") && movable.includes(target.closest<HTMLElement>(".editor-el")?.dataset.id ?? ""))
          ) {
            event.stop();
          }
        }}
        onSelectEnd={(event) => {
          const ids = event.selected.map((element) => (element as HTMLElement).dataset.id ?? "").filter(Boolean);
          onSelect(ids);
          if (event.isDragStart) {
            event.inputEvent.preventDefault();
            moveableRef.current?.waitToChangeTarget().then(() => moveableRef.current?.dragStart(event.inputEvent));
          }
        }}
      />
    </div>
  );
}
