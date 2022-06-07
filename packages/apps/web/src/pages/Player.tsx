import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Container from "@mui/material/Container";
import { makeStyles, createStyles } from "@mui/styles";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { Video } from "~/components/Video";
import { PlayerOverlay } from "~/containers/PlayerOverlay";
import { useFileQuery } from "~/generated/graphql";
import { NotFound } from "./NotFound";

const useStyles = makeStyles(
  createStyles({
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9000,
      display: "flex",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      background: "#000",
    },
  }),
  {
    name: "Player",
  },
);

export const Player = observer(() => {
  const { fileId = "" } = useParams<{ fileId: string }>();
  const classes = useStyles();

  const { data, loading, error } = useFileQuery({ variables: { fileId } });

  // const { data: probeData } = useProbeFileQuery({ variables: { fileId } });

  if (error) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error.message}
          <br />
          <pre style={{ whiteSpace: "pre-wrap" }}>{error.stack}</pre>
        </Alert>
      </Container>
    );
  }

  if (!loading && (!data || !data.file)) {
    return <NotFound />;
  }

  const file = data?.file;
  return (
    <div className={classes.container}>
      {file && <Video key={file.id} file={file} />}
      <PlayerOverlay />
    </div>
  );
});
