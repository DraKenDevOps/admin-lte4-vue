const STORAGE_KEYS = {
  webToken: "webToken",
  appSidebarState: "appSidebarState",
  appTheme: "appTheme"
};
const THEMES = ["light", "dark", "auto"] as const;
export type Theme = "light" | "dark" | "auto";

export type TStorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
export { STORAGE_KEYS, THEMES };
