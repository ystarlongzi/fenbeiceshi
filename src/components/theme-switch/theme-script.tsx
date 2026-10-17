import { themeBootstrap } from "./theme";

export function ThemeScript() {
  return <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeBootstrap }} />;
}
