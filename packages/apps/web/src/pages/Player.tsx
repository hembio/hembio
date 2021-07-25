import { CircularProgress } from "@material-ui/core";
import Alert from "@material-ui/core/Alert";
import AlertTitle from "@material-ui/core/AlertTitle";
import Container from "@material-ui/core/Container";
import { makeStyles, createStyles } from "@material-ui/styles";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { NotFound } from "./NotFound";
import { Video } from "~/components/Video";
import { PlayerOverlay } from "~/containers/PlayerOverlay";
import { useFileQuery, useProbeFileQuery } from "~/generated/graphql";
import { useStores } from "~/stores";

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
    spinner: {
      color: "rgba(255, 255, 255, .8)",
      placeSelf: "center",
    },
  }),
  {
    name: "Player",
  },
);

export const Player = observer(() => {
  const { fileId } = useParams<{ fileId: string }>();
  const { playerStore } = useStores();
  const classes = useStyles();

  const { data, loading, error } = useFileQuery({ variables: { fileId } });

  const { data: probeData } = useProbeFileQuery({ variables: { fileId } });

  if (loading) {
    return (
      <div className={classes.container}>
        <CircularProgress className={classes.spinner} size={64} />
      </div>
    );
  }

  if (error) {
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
  }

  if (!data || !data.file) {
    return <NotFound />;
  }

  const { file } = data;
  return (
    <div className={classes.container}>
      {playerStore.isPending && (
        <CircularProgress className={classes.spinner} size={64} />
      )}
      {file && <Video key={file.id} file={file} />}
      <PlayerOverlay />
    </div>
  );
});
