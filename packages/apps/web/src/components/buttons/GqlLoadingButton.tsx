import { useMutation, DocumentNode } from "@apollo/client";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { ReactNode, useEffect } from "react";

interface Props<V> {
  children?: ReactNode;
  mutation: DocumentNode;
  variables: V;
  // eslint-disable-next-line
  onDone?(error?: any, data?: any): void;
}

export function GqlLoadingButton<T, V>({
  children,
  mutation,
  variables,
  onDone,
}: Props<V>): JSX.Element {
  const [execute, { loading, data, error }] = useMutation<T, V>(mutation);
  const handle = async () => {
    try {
      await execute({ variables });
    } catch {
      // Ignore
    }
  };
  useEffect(() => {
    if (onDone && (error || data)) {
      onDone(error, data);
    }
  }, [error, data]);

  return (
    <LoadingButton variant="contained" loading={loading} onClick={handle}>
      {children}
    </LoadingButton>
  );
}
