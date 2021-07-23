import Alert from "@material-ui/core/Alert";
import AlertTitle from "@material-ui/core/AlertTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import { createStyles, makeStyles } from "@material-ui/styles";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { TitleCard } from "../components/TitleCard";
import { TitleEntity, useTitlesQuery } from "../generated/graphql";

const useStyles = makeStyles(
  createStyles({
    container: {
      display: "flex",
      padding: "8px 0px",
      flexFlow: "wrap",
      // justifyContent: "space-between",
      justifyContent: "center",
      userSelect: "none",
    },
    spinner: {
      placeSelf: "center",
    },
  }),
  { name: "TitleList" },
);

interface Props {
  libraryId: string;
}

const titlesPerPage = 10 * 5;

export const TitleList = ({ libraryId }: Props): JSX.Element | null => {
  const classes = useStyles();
  const [page, setPage] = useState<number>(0);
  const { data, loading, error, refetch } = useTitlesQuery({
    variables: {
      libraryId,
      skip: page * titlesPerPage,
      take: titlesPerPage,
    },
    partialRefetch: true,
  });
  const [titleMap, setTitleMap] = useState(new Map<number, TitleEntity>());

  useEffect(() => {
    const titles = data?.library?.titles;
    if (!loading && titles) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTitleMap((prev) => new Map([...prev, [page, titles.edges as any]]));
    }
  }, [loading, page, data]);

  const nextPage = () => {
    setPage(page + 1);
  };

  if (error) {
    return (
      <div className={classes.container}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error.message}
        </Alert>
      </div>
    );
  }

  // if (loading) {
  //   return (
  //     <div className={classes.container}>
  //       <CircularProgress className={classes.spinner} size={"8%"} />
  //     </div>
  //   );
  // }

  const titles = [...titleMap.values()].flat();

  return (
    <InfiniteScroll
      scrollableTarget="root"
      className={classes.container}
      dataLength={titles.length}
      next={nextPage}
      hasMore={true}
      loader={
        <Container>
          <CircularProgress />
        </Container>
      }
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
      refreshFunction={() => {
        refetch();
      }}
      pullDownToRefresh
      pullDownToRefreshThreshold={50}
      pullDownToRefreshContent={
        <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
      }
      releaseToRefreshContent={
        <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
      }
    >
      {titles.map((title) => (
        <TitleCard key={title.id} title={title} />
      ))}
    </InfiniteScroll>
  );
};
