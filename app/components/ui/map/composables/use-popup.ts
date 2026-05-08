import { onBeforeUnmount, shallowRef, watch, type MaybeRefOrGetter, toValue } from "vue";
import MapLibreGL, { type PopupOptions } from "maplibre-gl";

/**
 * Encapsulates MapLibre Popup creation, the Teleport target div, and the
 * reactive sync of `offset` / `maxWidth` while the popup is open.
 *
 * The caller decides *when* to instantiate the popup (e.g. attach to a
 * marker, or open it directly on the map) by calling `create()`.
 */
export function usePopup(
  options: MaybeRefOrGetter<PopupOptions | undefined>,
) {
  const container = document.createElement("div");
  const popup = shallowRef<MapLibreGL.Popup | null>(null);

  const create = (extra?: Partial<PopupOptions>) => {
    const opts = toValue(options) ?? {};
    const instance = new MapLibreGL.Popup({
      offset: 16,
      ...opts,
      ...extra,
      // closeButton is rendered by PopupShell, never by MapLibre itself
      closeButton: false,
    })
      .setMaxWidth(opts.maxWidth ?? "none")
      .setDOMContent(container);
    popup.value = instance;
    return instance;
  };

  watch(
    () => toValue(options)?.offset,
    (next) => {
      const p = popup.value;
      if (!p?.isOpen()) return;
      p.setOffset(next ?? 16);
    },
  );

  watch(
    () => toValue(options)?.maxWidth,
    (next) => {
      const p = popup.value;
      if (!p?.isOpen() || !next) return;
      p.setMaxWidth(next);
    },
  );

  onBeforeUnmount(() => {
    if (popup.value?.isOpen()) popup.value.remove();
    popup.value = null;
  });

  return { container, popup, create };
}
