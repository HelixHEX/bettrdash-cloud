import { useOutletContext } from "react-router-dom";

export function usePath(): string {
  console.log(new URL(window.location.href));
  return new URL(window.location.href).pathname;
}

export { useHomePage, useSettingsPage, useProfilePage } from "./pages";

export const useOutlet = () => {
  return useOutletContext<OutletContext>();
};
