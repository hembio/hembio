import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useIdentifyTitleQuery } from "../generated/graphql";

interface Props {
  titleId: string;
  open?: boolean;
  onClose?: () => void;
}

export function IdentifyDialog({
  titleId,
  open = false,
  onClose,
}: Props): JSX.Element {
  const theme = useTheme();
  const { data } = useIdentifyTitleQuery({
    variables: { id: titleId },
    skip: !open,
  });
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const results = data?.title?.identify || [];

  const handleSave = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog fullWidth={true} fullScreen={fullScreen} open={open}>
      <DialogTitle id="responsive-dialog-title">Identify</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ userSelect: "text" }}>
          <ul>
            {results.map((result) => (
              <li key={result.externalId}>
                {result.name} ({result.year}) {result.externalId}
              </li>
            ))}
          </ul>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" autoFocus color="primary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          autoFocus
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
