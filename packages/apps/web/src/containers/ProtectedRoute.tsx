import { Observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";
import { useStores } from "../stores";

export const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { authStore } = useStores();
  return (
    <Observer>
      {() => (
        <>
          {!authStore.isAuthenticated ? (
            <Navigate to="/sign-in" replace />
          ) : (
            children
          )}
        </>
      )}
    </Observer>
  );
};
