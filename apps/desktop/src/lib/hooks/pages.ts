import { usePath } from "./index";

export const useHomePage = () => {
  const path = usePath();
  return path === "#/";
};

export const useSettingsPage = () => {
  const path = usePath();
  return path.includes("settings");
};

export const useProfilePage = () => {
  const path = usePath();
  return path.includes("profile");
};
