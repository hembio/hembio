import { useMutation, DocumentNode } from "@apollo/client";
import { MenuItem, MenuItemProps } from "@mui/material";
import { MouseEvent, ReactNode, useEffect } from "react";

interface Props<V> extends MenuItemProps {
  children?: ReactNode;
  mutation: DocumentNode;
  variables: V;
  // eslint-disable-next-line
  onDone?(error?: any, data?: any): void;
}

export function GqlMenuItem<T, V>({
  children,
  mutation,
  variables,
  onDone,
  onClick,
  ...menuItemProps
}: Props<V>): JSX.Element {
  const [execute, { loading, data, error }] = useMutation<T, V>(mutation);
  const handle = async (event: MouseEvent<HTMLLIElement>): Promise<void> => {
    try {
      await execute({ variables });
    } catch {
      // Ignore
    }
    if (onClick) {
      onClick(event);
    }
  };
  useEffect(() => {
    if (onDone && !loading && (error || data)) {
      onDone(error, data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, data]);

  return (
    <MenuItem {...menuItemProps} onClick={handle}>
      {children}
    </MenuItem>
  );
}
