import { useApolloClient } from "@apollo/client";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import coldark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";
import { GqlLoadingButton } from "~/components/buttons/GqlLoadingButton";
import { RestLoadingButton } from "~/components/buttons/RestLoadingButton";
import { IdentifyDialog } from "~/dialogs/IdentifyDialog";
import {
  DeleteTitleDocument,
  DeleteTitleMutation,
  DeleteTitleMutationVariables,
  TitleWithFilesFragment,
  UpdateCreditsDocument,
  UpdateCreditsMutation,
  UpdateCreditsMutationVariables,
  UpdateMetadataDocument,
  UpdateMetadataMutation,
  UpdateMetadataMutationVariables,
} from "~/generated/graphql";

interface Props {
  title: TitleWithFilesFragment;
  reload: (goBack?: boolean) => void;
  refetch: () => void;
}

export function TitleDebugBox({ title, reload, refetch }: Props): JSX.Element {
  const [openIdentityDialog, setOpenIdentityDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const { cache } = useApolloClient();
  const { files, id: titleId } = title;
  return (
    <Paper>
      <Container sx={{ p: 4, mt: 6, mb: 6, position: "relative" }}>
        <Box>
          <FormGroup>
            <FormControlLabel
              label={<Typography variant="h5">Debug</Typography>}
              control={
                <Checkbox
                  value={open}
                  inputProps={{ "aria-label": "debug toggle" }}
                  icon={<KeyboardArrowUpIcon />}
                  checkedIcon={<KeyboardArrowDownIcon />}
                  onChange={() => setOpen(!open)}
                  sx={{
                    color: "white",
                    "&.Mui-checked": {
                      color: "white",
                    },
                  }}
                />
              }
            />
          </FormGroup>
        </Box>

        <Box sx={{ display: open ? "block" : "none" }}>
          <Box sx={{ mb: 2 }} />
          {files.map((file) => (
            <Box key={file.id} sx={{ mb: 2 }}>
              <Link to={`/play/${file.id}`}>
                <Button variant="contained">Play {file.id}</Button>
              </Link>
            </Box>
          ))}
          <Box sx={{ mb: 2 }}>
            <RestLoadingButton
              path={`/images/titles/download/${titleId}`}
              onDone={reload}
            >
              Download images
            </RestLoadingButton>
          </Box>
          <Box sx={{ mb: 2 }}>
            <GqlLoadingButton<
              UpdateMetadataMutation,
              UpdateMetadataMutationVariables
            >
              mutation={UpdateMetadataDocument}
              variables={{ id: titleId }}
              onDone={(error, _data) => {
                if (error) {
                  console.error(error);
                  return;
                }
                refetch();
              }}
            >
              Update metadata
            </GqlLoadingButton>
          </Box>
          <Box sx={{ mb: 2 }}>
            <GqlLoadingButton<
              UpdateCreditsMutation,
              UpdateCreditsMutationVariables
            >
              mutation={UpdateCreditsDocument}
              variables={{ id: titleId }}
              onDone={(error, _data) => {
                if (error) {
                  console.error(error);
                  return;
                }
                refetch();
              }}
            >
              Update credits
            </GqlLoadingButton>
          </Box>
          <Box sx={{ mb: 2 }}>
            <GqlLoadingButton<DeleteTitleMutation, DeleteTitleMutationVariables>
              mutation={DeleteTitleDocument}
              variables={{ id: titleId }}
              onDone={(error, data) => {
                if (error) {
                  console.error(error);
                  return;
                }
                const deletedId = data.deleteTitle.id;
                cache.evict({ id: `TitleEntity:${deletedId}` });
                cache.evict({ id: `TitleFragment:${deletedId}` });
                reload(true);
              }}
            >
              Delete title
            </GqlLoadingButton>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenIdentityDialog(true)}
            >
              Identify
            </Button>
            <IdentifyDialog
              titleId={title.id}
              open={openIdentityDialog}
              onClose={() => setOpenIdentityDialog(false)}
            />
          </Box>

          <Typography variant="h5">TitleEntity</Typography>
          <Box
            sx={{
              mt: 2,
              zIndex: 4000,
              userSelect: "text",
            }}
          >
            <SyntaxHighlighter language="json" style={{ ...coldark }}>
              {JSON.stringify(title, null, 2)}
            </SyntaxHighlighter>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
}
