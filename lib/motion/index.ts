/**
 * lib/motion/index.ts
 *
 * Vayam motion system — Framer Motion variants and spring configurations.
 *
 * Motion principles:
 *   Fast     (<150ms)  — Micro-interactions: button press, toggle, icon swap
 *   Medium   (200-300ms) — Card transitions, panel reveals, dropdown open
 *   Slow     (400-600ms) — Page transitions, major layout shifts
 *
 * All animations must respect `prefers-reduced-motion`.
 * In Framer Motion components, use `useReducedMotion()` to disable animations.
 *
 * This module is pure — no React imports.
 */

import type { Variants, Transition } from "framer-motion";

// ---------------------------------------------------------------------------
// Duration constants (ms) — mirrors CSS vars in globals.css
// ---------------------------------------------------------------------------

export const DURATION = {
  fast:   0.12,
  medium: 0.22,
  slow:   0.40,
  slower: 0.60,
} as const;

// ---------------------------------------------------------------------------
// Easing curves
// ---------------------------------------------------------------------------

export const EASING = {
  /** Standard ease for most UI motion */
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
  /** Ease out — for elements entering the screen */
  out:    [0, 0, 0.2, 1] as [number, number, number, number],
  /** Ease in — for elements leaving the screen */
  in:     [0.4, 0, 1, 1] as [number, number, number, number],
  /** Spring-like overshoot — for playful confirmations */
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
} as const;

// ---------------------------------------------------------------------------
// Spring configs (for framer-motion `transition: { type: "spring" }`)
// ---------------------------------------------------------------------------

export const SPRING = {
  /** Stiff spring — fast, barely overshoots. Good for small UI elements. */
  stiff: {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    mass: 1,
  },

  /** Gentle spring — medium speed with a subtle bounce. Good for cards. */
  gentle: {
    type: "spring" as const,
    stiffness: 200,
    damping: 20,
    mass: 1,
  },

  /** Slow spring — soft landing. Good for page-level transitions. */
  slow: {
    type: "spring" as const,
    stiffness: 80,
    damping: 16,
    mass: 1,
  },
} as const;

// ---------------------------------------------------------------------------
// Standard transitions
// ---------------------------------------------------------------------------

export const TRANSITION: Record<string, Transition> = {
  fast:   { duration: DURATION.fast,   ease: EASING.smooth },
  medium: { duration: DURATION.medium, ease: EASING.smooth },
  slow:   { duration: DURATION.slow,   ease: EASING.out },
  enter:  { duration: DURATION.medium, ease: EASING.out },
  exit:   { duration: DURATION.fast,   ease: EASING.in },
};

// ---------------------------------------------------------------------------
// Reusable animation variants
// ---------------------------------------------------------------------------

/** Simple fade */
export const fadeVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: TRANSITION.medium },
  exit:    { opacity: 0, transition: TRANSITION.exit },
};

/** Fade + slide up (cards, modals entering from below) */
export const slideUpVariants: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: TRANSITION.enter },
  exit:    { opacity: 0, y: -8, transition: TRANSITION.exit },
};

/** Fade + slide down (dropdowns, panels entering from above) */
export const slideDownVariants: Variants = {
  hidden:  { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: TRANSITION.enter },
  exit:    { opacity: 0, y: -8, transition: TRANSITION.exit },
};

/** Scale in (context menus, tooltips, small overlays) */
export const scaleVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: TRANSITION.enter },
  exit:    { opacity: 0, scale: 0.95, transition: TRANSITION.exit },
};

/** Stagger container — use on parent to stagger children */
export const staggerContainerVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

/** Stagger child — pair with staggerContainerVariants on parent */
export const staggerChildVariants: Variants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: TRANSITION.enter },
};

/**
 * Reduced-motion safe variants.
 * When prefers-reduced-motion is active, swap regular variants for these.
 * They animate only opacity (no position/scale changes).
 */
export const reducedMotionVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.fast } },
  exit:    { opacity: 0, transition: { duration: DURATION.fast } },
};
