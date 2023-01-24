import { useSearchParams } from "react-router-dom";

interface PlanTypes {
  [k: string]: string;
}
export const useCustomSearchParams = (): [
  PlanTypes,
  (search: Record<string, string>) => void
] => {
  const [search, setSearch] = useSearchParams();
  const searchAsObject = Object.fromEntries(new URLSearchParams(search));
  return [searchAsObject, setSearch];
};
