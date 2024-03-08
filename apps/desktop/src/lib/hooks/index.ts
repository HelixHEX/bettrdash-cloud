export function usePath(): string {
  return new URL(window.location.href).pathname;
}

export { useHomePage, useSettingsPage, useProfilePage } from "./pages";
