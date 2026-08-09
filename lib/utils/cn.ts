/**
 * lib/utils/cn.ts
 *
 * Class name utility — merges Tailwind class strings safely.
 *
 * A minimal implementation that avoids pulling in clsx/tailwind-merge
 * for Phase 01.  If class conflicts become frequent as the component
 * library grows, replace this with clsx + tailwind-merge.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
