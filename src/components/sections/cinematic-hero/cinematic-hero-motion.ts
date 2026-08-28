import {
  SCENE_PUSH_TARGET_SCALE,
} from "@/components/sections/cinematic-hero/cinematic-hero.config";

export function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

export function ease(value: number) {
  return value * value * (3 - 2 * value);
}

export function progressBetween(value: number, start: number, end: number) {
  return ease(clamp((value - start) / (end - start)));
}

export function getTriggeredImageScale(sceneIndex: number) {
  if (sceneIndex === 0) return 1;
  if (sceneIndex === 1) return 1.018;
  if (sceneIndex === 2) return 1.022;
  if (sceneIndex === 3) return 1.02;
  return 1.049;
}

export function getTriggeredImageTransform(
  sceneIndex: number,
  drift: number,
) {
  if (sceneIndex === 0) return "scale(1)";
  if (sceneIndex === 1) {
    return `translate3d(0, ${-Math.min(drift, 2)}svh, 0) scale(1.018)`;
  }
  if (sceneIndex === 2) {
    return "translate3d(0, -3svh, 0) scale(1.022)";
  }
  if (sceneIndex === 3) {
    return "translate3d(0, -2.5svh, 0) scale(1.02)";
  }
  return "translate3d(0, -1.5svh, 0) scale(1.049)";
}

export function getScenePushDrift(sceneIndex: number) {
  if (sceneIndex === 0) return "translate3d(-1vw, -0.35svh, 0)";
  if (sceneIndex === 1) return "translate3d(0, 0, 0)";
  if (sceneIndex === 2) return "translate3d(0, -1svh, 0)";
  if (sceneIndex === 3) return "translate3d(1vw, -0.35svh, 0)";
  return "translate3d(0, -0.3svh, 0)";
}

export function getSceneCopyDrift(sceneIndex: number) {
  if (sceneIndex === 0) return "translate3d(0.6vw, 0.2svh, 0)";
  if (sceneIndex === 1) return "none";
  if (sceneIndex === 2) return "translate3d(0, 0.6svh, 0)";
  if (sceneIndex === 3) return "translate3d(-0.6vw, 0.2svh, 0)";
  return "translate3d(0, 0.3svh, 0)";
}

export function getPushedImageTransform(
  sceneIndex: number,
  drift: number,
) {
  const pushScale =
    SCENE_PUSH_TARGET_SCALE / getTriggeredImageScale(sceneIndex);

  return `${getTriggeredImageTransform(sceneIndex, drift)} ${getScenePushDrift(sceneIndex)} scale(${pushScale})`;
}
