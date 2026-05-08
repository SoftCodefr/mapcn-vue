import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  type ComputedRef,
  type MaybeRefOrGetter,
} from "vue";
import type { Theme } from "../types";

function getDocumentTheme(): Theme | null {
  if (typeof document === "undefined") return null;
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.documentElement.classList.contains("light")) return "light";
  return null;
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Resolves the active theme from three sources, in priority order:
 *  1. `themeProp` (explicit override)
 *  2. `.dark` / `.light` class on `<html>` (compatible with next-themes,
 *     `useColorMode`, and any class-based theme switcher)
 *  3. OS preference (`prefers-color-scheme`)
 *
 * Watches the document class list and the system preference for changes.
 */
export function useResolvedTheme(
  themeProp?: MaybeRefOrGetter<Theme | undefined>,
): ComputedRef<Theme> {
  const docTheme = ref<Theme | null>(getDocumentTheme());
  const sysTheme = ref<Theme>(getSystemTheme());

  onMounted(() => {
    const obs = new MutationObserver(() => {
      docTheme.value = getDocumentTheme();
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      sysTheme.value = e.matches ? "dark" : "light";
    };
    mq.addEventListener("change", onChange);

    onBeforeUnmount(() => {
      obs.disconnect();
      mq.removeEventListener("change", onChange);
    });
  });

  return computed(() => toValue(themeProp) ?? docTheme.value ?? sysTheme.value);
}
