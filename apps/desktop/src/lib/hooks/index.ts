import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export function usePath(): string {
  useEffect(() => {
    console.log(new URL(window.location.href));
  }, []);
  const url = new URL(window.location.href);
  return url.hash || url.pathname;
}

export { useHomePage, useSettingsPage, useProfilePage } from "./pages";

export const useOutlet = () => {
  return useOutletContext<OutletContext>();
};
