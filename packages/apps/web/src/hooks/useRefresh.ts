import { useHistory, useLocation } from "react-router-dom";

export function useRefresh(): () => void {
  const history = useHistory();
  const location = useLocation();
  const refresh = () => {
    const newLoc = {
      ...location,
      state: undefined,
      key: Date.now().toString(),
    };
    history.replace(newLoc);
  };
  return refresh;
}
