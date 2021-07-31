import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useState } from "react";
import { LibraryType } from "../generated/graphql";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddLibraryDialog({
  open = false,
  onClose,
}: Props): JSX.Element {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [name, setName] = useState("");
  const [type, setType] = useState<LibraryType>();
  const [path, setPath] = useState("");

  const handleSave = () => {
    onClose();
  };

  return (
    <Dialog fullWidth={true} fullScreen={fullScreen} open={open}>
      <form>
        <DialogTitle id="responsive-dialog-title">Add library</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth={true}
            variant="filled"
            id="name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogContent>
          <FormControl fullWidth={true} variant="filled">
            <InputLabel id="content-type">Content type</InputLabel>
            <Select
              labelId="content-type"
              id="content-type"
              value={type}
              label="Content type"
              onChange={(e) => setType(e.target.value as LibraryType)}
            >
              <MenuItem value={LibraryType.Movies}>Movies</MenuItem>
              <MenuItem value={LibraryType.Tvshows}>TV Shows</MenuItem>
              <MenuItem value={LibraryType.Music}>Music</MenuItem>
              <MenuItem value={LibraryType.Podcasts}>Podcasts</MenuItem>
              <MenuItem value={LibraryType.Photos}>Photos</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogContent>
          <TextField
            fullWidth={true}
            variant="filled"
            id="path"
            label="Path"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            autoFocus
            color="primary"
            onClick={onClose}
          >
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
      </form>
    </Dialog>
  );
}
