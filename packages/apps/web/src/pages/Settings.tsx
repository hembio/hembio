import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";
import { RestLoadingButton } from "~/components/buttons/RestLoadingButton";
import { AddLibraryDialog } from "~/dialogs/AddLibraryDialog";

export function Settings(): JSX.Element {
  const [addLibraryDialog, setAddLibraryDialog] = useState(false);

  return (
    <Container>
      <Typography variant="h5" color="body1" sx={{ mb: 2 }}>
        Debug
      </Typography>
      <p>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddLibraryDialog(true)}
        >
          Add library
        </Button>
        <AddLibraryDialog
          open={addLibraryDialog}
          onClose={() => setAddLibraryDialog(false)}
        />
      </p>
      <p>
        <RestLoadingButton path={`/indexer/run`}>Run indexer</RestLoadingButton>
      </p>
      <p>
        <RestLoadingButton path={`/images/download`}>
          Download images
        </RestLoadingButton>
      </p>
    </Container>
  );
}
