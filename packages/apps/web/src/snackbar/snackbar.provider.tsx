import Alert, { AlertColor } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
import { SnackbarApi } from "./snackbar-api.interface";
import { SnackbarContext } from "./snackbar.context";

interface SnackbarProviderProps {
  children: React.ReactNode;
}

export interface SnackbarMessage {
  key: string;
  message: string;
  severity?: AlertColor;
}

export interface SnackbarOptions {
  severity?: AlertColor;
}

export const SnackbarProvider = ({
  children,
}: SnackbarProviderProps): JSX.Element => {
  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | undefined>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (snackPack.length && !snackbar) {
      // Set a new snack when we don't have an active one
      setSnackbar({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && snackbar && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, snackbar, open]);

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleExited = (): void => {
    setSnackbar(undefined);
  };

  const api: SnackbarApi = {
    addSnackbar: (message, { severity = "success" } = {}) => {
      setSnackPack([
        ...snackPack,
        {
          key: `snackbar-${snackPack.length}`,
          message,
          severity,
        },
      ]);
      setOpen(true);
    },
    closeSnackbar: () => {
      setOpen(false);
    },
  };

  return (
    <SnackbarContext.Provider value={api}>
      {children}
      <Snackbar
        key={snackbar ? snackbar.key : undefined}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
      >
        {snackbar && (
          <Alert severity={snackbar.severity || "info"}>
            {snackbar.message}
          </Alert>
        )}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
