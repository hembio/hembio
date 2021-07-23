import { Route, Redirect, RouteProps } from "react-router-dom";
import { Observer } from "mobx-react-lite";
import { useStores } from "../stores";

interface ProtectedRouteProps extends RouteProps {
  default?: boolean;
  component?: React.ComponentType<RouteProps>;
}

export const ProtectedRoute = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  component: Component,
  children,
  ...rest
}: ProtectedRouteProps): JSX.Element => {
  const { authStore } = useStores();
  return (
    <Observer>
      {() => (
        <Route {...rest}>
          {!authStore.isAuthenticated ? <Redirect to="/sign-in" /> : children}
        </Route>
      )}
    </Observer>
  );
};
