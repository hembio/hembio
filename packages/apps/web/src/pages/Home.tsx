import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import moviesCollage from "$/movies_collage.jpg";
import { NewlyAddedList } from "~/containers/NewlyAddedList";
import { useLibrariesQuery } from "~/generated/graphql";
import { isElectron } from "~/utils/isElectron";

export const Home = (): JSX.Element | null => {
  const { loading, error, data } = useLibrariesQuery();

  if (error || loading || !data) {
    return null;
  }

  const { libraries } = data;
  return (
    <Container maxWidth={isElectron() ? false : "lg"}>
      <Typography sx={{ mb: 2 }} variant="h5" component="h2">
        Libraries
      </Typography>
      <Grid container sx={{ mb: 2 }}>
        {libraries.map((library) => {
          return (
            <Grid item key={library.id}>
              <Link to={`/library/${library.id}`}>
                <Card sx={{ width: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      sx={{ height: 140 }}
                      title={library.name}
                      image={moviesCollage}
                    />
                    <CardContent>
                      <Typography variant="h5">{library.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
          );
        })}
      </Grid>
      <Typography sx={{ mb: 2 }} variant="h5" component="h2">
        Newly added movies
      </Typography>
      <NewlyAddedList libraryId="3ea63a40-4f33-5da1-a064-94fecd447ed4" />
    </Container>
  );
};
