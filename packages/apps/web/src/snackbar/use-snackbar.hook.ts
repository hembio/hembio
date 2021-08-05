import { useContext } from "react";
import { SnackbarApi } from "./snackbar-api.interface";
import { SnackbarContext } from "./snackbar.context";

export const useSnackbar = (): SnackbarApi => useContext(SnackbarContext);
