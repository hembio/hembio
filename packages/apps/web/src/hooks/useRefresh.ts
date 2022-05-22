import { useLocation, useNavigate } from "react-router-dom";

export function useRefresh(): () => void {
  const navigate = useNavigate();
  const location = useLocation();
  const refresh = (): void => {
    const newLoc = {
      ...location,
      state: undefined,
      key: Date.now().toString(),
    };
    navigate(newLoc);
  };
  return refresh;
}
