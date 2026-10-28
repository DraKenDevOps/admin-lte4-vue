/**
 * Height slide helpers ported from AdminLTE 4's `slideUp` / `slideDown`.
 *
 * AdminLTE animates `height`, `margin` and `padding` inline and leaves the
 * final `display` value inline, which is what its CSS relies on for treeviews
 * and collapsible cards. Keeping the same implementation means our timing and
 * intermediate frames match the reference exactly.
 */

const slideTimers = new WeakMap<HTMLElement, number[]>();

const SLIDE_PROPERTIES = [
  "height",
  "padding-top",
  "padding-bottom",
  "margin-top",
  "margin-bottom",
  "overflow",
  "transition-duration",
  "transition-property"
] as const;

function cancelSlide(target: HTMLElement): void {
  const timers = slideTimers.get(target) ?? [];
  for (const timer of timers) window.clearTimeout(timer);
  slideTimers.delete(target);
}

function clearSlideStyles(target: HTMLElement): void {
  for (const property of SLIDE_PROPERTIES) target.style.removeProperty(property);
}

/** Collapse an element to zero height, then hide it. */
export function slideUp(target: HTMLElement, duration = 500): void {
  cancelSlide(target);

  const resolved = resolveDuration(duration);
  if (resolved <= 1) {
    target.style.display = "none";
    clearSlideStyles(target);
    return;
  }

  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = `${resolved}ms`;
  target.style.boxSizing = "border-box";
  target.style.height = `${target.offsetHeight}px`;
  target.style.overflow = "hidden";

  const stepTimer = window.setTimeout(() => {
    target.style.height = "0";
    target.style.paddingTop = "0";
    target.style.paddingBottom = "0";
    target.style.marginTop = "0";
    target.style.marginBottom = "0";
  }, 1);

  const cleanupTimer = window.setTimeout(() => {
    target.style.display = "none";
    clearSlideStyles(target);
    slideTimers.delete(target);
  }, resolved);

  slideTimers.set(target, [stepTimer, cleanupTimer]);
}

/** Reveal an element and expand it to its natural height. */
export function slideDown(target: HTMLElement, duration = 500): void {
  cancelSlide(target);
  clearSlideStyles(target);
  target.style.removeProperty("display");

  let { display } = window.getComputedStyle(target);
  if (display === "none") display = "block";
  target.style.display = display;

  const resolved = resolveDuration(duration);
  if (resolved <= 1) return;

  const height = target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = "0";
  target.style.paddingTop = "0";
  target.style.paddingBottom = "0";
  target.style.marginTop = "0";
  target.style.marginBottom = "0";

  const stepTimer = window.setTimeout(() => {
    target.style.boxSizing = "border-box";
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = `${resolved}ms`;
    target.style.height = `${height}px`;
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
  }, 1);

  const cleanupTimer = window.setTimeout(() => {
    clearSlideStyles(target);
    slideTimers.delete(target);
  }, resolved);

  slideTimers.set(target, [stepTimer, cleanupTimer]);
}

/** AdminLTE disables its animations when the user asks for reduced motion. */
function resolveDuration(duration: number): number {
  if (duration <= 1) return duration;
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return duration;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : duration;
}
