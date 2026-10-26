import type { CSSProperties } from "react";
import {
  STAGE,
  cssColor,
  cssFont,
  isGradient,
  type CanvasElement,
  type CanvasSlide,
  type ColorValue,
} from "@/lib/canvas/model";

/** 1 logical px of the 1600-wide stage, in container units. */
const unit = (value: number) => `${(value / STAGE.width) * 100}cqw`;

function paint(value: ColorValue | null | undefined): CSSProperties {
  if (!value) return {};
  return isGradient(value) ? { backgroundImage: cssColor(value) } : { backgroundColor: cssColor(value) };
}

export function elementStyle(element: CanvasElement): CSSProperties {
  const style: CSSProperties = {
    position: "absolute",
    left: `${(element.x / STAGE.width) * 100}%`,
    top: `${(element.y / STAGE.height) * 100}%`,
    width: `${(element.w / STAGE.width) * 100}%`,
    height: `${(element.h / STAGE.height) * 100}%`,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    opacity: element.opacity ?? 1,
  };

  switch (element.type) {
    case "text": {
      const font = element.font;
      Object.assign(style, paint(element.fill), {
        fontFamily: font ? cssFont(font.family) : undefined,
        fontSize: font ? unit(font.size) : undefined,
        fontWeight: font?.weight,
        lineHeight: font?.lineHeight,
        letterSpacing: font ? `${font.letterSpacing}em` : undefined,
        textAlign: font?.align,
        fontStyle: font?.italic ? "italic" : undefined,
        textTransform: font?.uppercase ? "uppercase" : undefined,
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
        borderRadius: element.radius ? unit(element.radius) : undefined,
      });
      if (isGradient(element.color)) {
        Object.assign(style, {
          backgroundImage: cssColor(element.color),
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        });
      } else {
        style.color = cssColor(element.color);
      }
      break;
    }
    case "rect":
    case "ellipse":
      Object.assign(style, paint(element.fill), {
        borderRadius: element.type === "ellipse" ? "50%" : element.radius ? unit(element.radius) : undefined,
        border: element.stroke ? `${unit(element.stroke.width)} solid ${cssColor(element.stroke.color)}` : undefined,
      });
      break;
    case "line":
      Object.assign(style, paint(element.color), { borderRadius: unit(element.h) });
      break;
  }
  return style;
}

export function stageStyle(slide: CanvasSlide): CSSProperties {
  return paint(slide.background);
}

/** Static rendering of one element (projection and thumbnails). */
export function CanvasElementView({ element }: { element: CanvasElement }) {
  return (
    <div className="canvas-el" data-type={element.type} style={elementStyle(element)}>
      {element.type === "text" ? element.text : null}
    </div>
  );
}

/** A full canvas slide; place it in a container with `container-type` set. */
export function CanvasView({ slide }: { slide: CanvasSlide }) {
  return (
    <div className="canvas-stage" style={stageStyle(slide)}>
      {slide.elements.map((element) => (
        <CanvasElementView key={element.id} element={element} />
      ))}
    </div>
  );
}
