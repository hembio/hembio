import { SnackbarOptions } from "./snackbar.provider";

export interface SnackbarApi {
  addSnackbar: (content: string, options?: SnackbarOptions) => void;
  closeSnackbar: () => void;
}
