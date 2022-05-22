import { useMutation, DocumentNode } from "@apollo/client";
import LoadingButton from "@mui/lab/LoadingButton";
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
  const handle = async (): Promise<void> => {
    try {
      await execute({ variables });
    } catch {
      // Ignore
    }
  };
  useEffect(() => {
    if (onDone && !loading && (error || data)) {
      onDone(error, data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, data]);

  return (
    <LoadingButton variant="contained" loading={loading} onClick={handle}>
      {children}
    </LoadingButton>
  );
}
