export function usePath(): string {
  return new URL(window.location.href).hash;
}

export { useHomePage, useSettingsPage, useProfilePage } from "./pages";
