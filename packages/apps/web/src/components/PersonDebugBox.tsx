import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import coldark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";
import { PersonFragment } from "~/generated/graphql";

interface Props {
  person: PersonFragment;
  refetch: () => void;
}

export function PersonDebugBox({
  person,
}: // reload,
// refetch,
Props): JSX.Element {
  // const [openIdentityDialog, setOpenIdentityDialog] = useState(false);
  const [open, setOpen] = useState(false);
  // const { cache } = useApolloClient();
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

        {open && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5">PersonEntity</Typography>
            <Box
              sx={{
                mt: 2,
                zIndex: 4000,
                userSelect: "text",
              }}
            >
              <SyntaxHighlighter language="json" style={{ ...coldark }}>
                {JSON.stringify(person, null, 2)}
              </SyntaxHighlighter>
            </Box>
          </Box>
        )}
      </Container>
    </Paper>
  );
}
