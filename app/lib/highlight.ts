import { codeToHtml } from "shiki";

/**
 * Render `code` to HTML using Shiki with dual themes.
 * - On the server: invoked at SSR time, the resulting HTML is sent in the
 *   initial response (no flash of unstyled code on the client).
 * - On the client: invoked at hydration time if the call wasn't cached.
 *
 * The dual-theme output uses CSS variables `--shiki-light` and `--shiki-dark`,
 * which `assets/css/main.css` flips based on the `.dark` class on `<html>`.
 */
export async function highlightCode(
  code: string,
  lang: string = "vue",
): Promise<string> {
  return codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
