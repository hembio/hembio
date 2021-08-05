import { createContext } from "react";
import { SnackbarApi } from "./snackbar-api.interface";

export const SnackbarContext = createContext<SnackbarApi>({} as SnackbarApi);
