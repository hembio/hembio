import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
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
  // const [open, setOpen] = useState(false);
  // const { cache } = useApolloClient();
  return (
    <Paper>
      <Container sx={{ p: 4, mt: 6, mb: 6, position: "relative" }}>
        <Box>
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
      </Container>
    </Paper>
  );
}
