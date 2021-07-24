import { Theme } from "@material-ui/core";
import Alert from "@material-ui/core/Alert";
import AlertTitle from "@material-ui/core/AlertTitle";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Pagination from "@material-ui/core/Pagination";
import PaginationItem from "@material-ui/core/PaginationItem";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles } from "@material-ui/styles";
import { useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { TitleCard } from "~/components/TitleCard";
import { FilterButton } from "~/components/buttons/FilterButton";
import { SortButton } from "~/components/buttons/SortButton";
import { useTitlesQuery } from "~/generated/graphql";
import { useListener } from "~/hooks/useListener";
import { useQueryStrings } from "~/hooks/useQueryString";

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
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

function useSearchParams() {
  const firstRun = useRef(true);
  const { p, ob, od } = useQueryStrings(["p", "ob", "od"]);
  const initialPage = Number(p) > 0 ? Number(p) - 1 : 0;
  const [orderBy, setOrderBy] = useState(ob || "releaseDate");
  const [orderDirection, setOrderDirection] = useState(od || "DESC");
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    if (!firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (p) {
      setPage(Number(p) - 1);
    }
    if (ob) {
      setOrderBy(ob);
    }
    if (od) {
      setOrderDirection(od);
    }
  }, [p, ob, od]);

  return {
    orderBy,
    setOrderBy,
    orderDirection,
    setOrderDirection,
    page,
    setPage,
  };
}

export const TitleList = ({ libraryId }: Props): JSX.Element | null => {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();

  const {
    orderBy,
    setOrderBy,
    orderDirection,
    setOrderDirection,
    page,
    setPage,
  } = useSearchParams();

  const rootRef = useRef(document.getElementById("root"));
  const windowRef = useRef(window);
  const [totalCount, setTotalCount] = useState(0);
  const { data, loading, error } = useTitlesQuery({
    variables: {
      libraryId,
      skip: page * titlesPerPage,
      take: titlesPerPage,
      orderBy,
      orderDirection,
    },
  });

  useListener<KeyboardEvent>(windowRef, "keydown", (e) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        handlePagination(Math.max(0, page - 1));
        rootRef.current?.scrollTo(0, 0);
        break;
      case "ArrowRight":
        e.preventDefault();
        handlePagination(
          Math.min(page + 1, Math.floor(totalCount / titlesPerPage)),
        );
        rootRef.current?.scrollTo(0, 0);
        break;
    }
  });

  useEffect(() => {
    const nextTotalCount = data?.library?.titles?.totalCount || 0;
    if (nextTotalCount > 0 && nextTotalCount !== totalCount) {
      setTotalCount(nextTotalCount);
    }
  }, [data?.library?.titles?.totalCount]);

  const edges = data?.library?.titles?.edges || [];
  const titles: Array<typeof edges[0] | undefined> = edges;
  if (loading) {
    titles.push(...new Array(titlesPerPage).fill(undefined));
  }

  const handleSort = (field: string, direction: string) => {
    setOrderBy(field);
    setOrderDirection(direction);
    setPage(0);
    rootRef.current?.scrollTo(0, 0);
    const params: Record<string, string> = {
      p: "1",
    };
    if (orderBy) {
      params["ob"] = field;
    }
    if (orderDirection) {
      params["od"] = direction;
    }
    history.push({
      pathname: location.pathname,
      search: new URLSearchParams(params).toString(),
      state: {},
    });
  };

  const handlePagination = (nextPage: number) => {
    setPage(nextPage);
    rootRef.current?.scrollTo(0, 0);
    const params: Record<string, string> = {};
    if (nextPage > 0) {
      params["p"] = (nextPage + 1).toString();
    }
    if (orderBy) {
      params["ob"] = orderBy;
    }
    if (orderDirection) {
      params["od"] = orderDirection;
    }
    history.push({
      pathname: location.pathname,
      search: new URLSearchParams(params).toString(),
      state: {},
    });
  };

  return (
    <Container>
      <Grid
        container
        sx={{ pb: 2, pt: 2 }}
        flexDirection="row"
        flexWrap="wrap"
        alignItems="baseline"
        alignContent="center"
        justifyContent="space-between"
      >
        <Grid item xs={12} md lg>
          {totalCount > 0 ? (
            <Typography sx={{ mb: 2, mt: 0 }}>
              Showing {(page * titlesPerPage + 1).toLocaleString()}
              {" - "}
              {((page + 1) * titlesPerPage).toLocaleString()} of{" "}
              {totalCount.toLocaleString()}
            </Typography>
          ) : null}
        </Grid>
        <Grid item flexWrap="nowrap" flexGrow={0} flexShrink={0}>
          <Pagination
            color="primary"
            count={Math.ceil(totalCount / titlesPerPage)}
            siblingCount={1}
            page={page + 1}
            onChange={(_e, page) => handlePagination(page - 1)}
            renderItem={(item) => (
              <PaginationItem
                // component={Link}
                // to={`/library/${libraryId}${
                //   item.page === 1 ? "" : `?p=${item.page}`
                // }`}
                {...item}
              />
            )}
          />
        </Grid>
        <Grid container item xs justifyContent="flex-end" flexDirection="row">
          <Grid item>
            <SortButton
              onSort={handleSort}
              orderBy={orderBy}
              orderDirection={orderDirection}
            />
          </Grid>
          <Grid item>
            <FilterButton
              onSort={handleSort}
              orderBy={orderBy}
              orderDirection={orderDirection}
            />
          </Grid>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridAutoFlow: "row",
          gridTemplateColumns: "repeat(auto-fit, 200px)",
          justifyContent: "space-between",
          alignContent: "space-between",
        }}
      >
        {error && (
          <Box>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error.message}
            </Alert>
          </Box>
        )}
        {titles.map((title, idx) => (
          <TitleCard key={title?.id || idx} title={title} />
        ))}
      </Box>
      <Grid container sx={{ pb: 4, pt: 4 }}>
        <Pagination
          sx={{ mx: "auto" }}
          color="primary"
          count={Math.ceil(totalCount / titlesPerPage)}
          siblingCount={1}
          page={page + 1}
          onChange={(_e, page) => handlePagination(page - 1)}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={`/library/${libraryId}${
                item.page === 1 ? "" : `?p=${item.page}`
              }`}
              {...item}
            />
          )}
        />
      </Grid>
    </Container>
  );
};
