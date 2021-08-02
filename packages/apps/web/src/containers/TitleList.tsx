import Alert from "@material-ui/core/Alert";
import AlertTitle from "@material-ui/core/AlertTitle";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Pagination from "@material-ui/core/Pagination";
import PaginationItem from "@material-ui/core/PaginationItem";
import Typography from "@material-ui/core/Typography";
import {
  Dispatch,
  memo,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useHistory } from "react-router-dom";
import { TitleCard } from "~/components/TitleCard";
import { FilterButton } from "~/components/buttons/FilterButton";
import { SortButton } from "~/components/buttons/SortButton";
import { useTitlesQuery } from "~/generated/graphql";
import { useListener } from "~/hooks/useListener";
import { useQueryStrings } from "~/hooks/useQueryString";

export interface FilterParams {
  year?: [number, number];
  genre?: Record<string, number>;
}

interface SearchParams {
  page: number;
  orderBy: string;
  orderDirection: string;
  filter: FilterParams;
}

const createSearchURL = ({
  page,
  orderBy,
  orderDirection,
}: SearchParams): string => {
  const params: Record<string, string> = {};
  if (page) {
    params["p"] = page.toString();
  }
  if (orderBy && orderBy !== "releaseDate") {
    params["ob"] = orderBy;
  }
  if (orderDirection && orderDirection !== "DESC") {
    params["od"] = orderDirection;
  }
  const searchParams = new URLSearchParams(params).toString();
  return searchParams ? `?${searchParams}` : "";
};

const titlesPerPage = 10 * 5;
const defaultOrderBy = "releaseDate";
const defaultOrderDirection = "DESC";

interface UseSearchParamsReturn {
  searchParams: SearchParams;
  setters: {
    setPage: Dispatch<SetStateAction<number>>;
    setOrderBy: Dispatch<SetStateAction<string>>;
    setOrderDirection: Dispatch<SetStateAction<string>>;
    setFilter: Dispatch<SetStateAction<FilterParams>>;
  };
}

function useSearchParams(): UseSearchParamsReturn {
  const firstRun = useRef(true);
  const { p, ob, od } = useQueryStrings(["p", "ob", "od"]);
  const initialPage = Number(p) > 0 ? Number(p) - 1 : 0;
  const [orderBy, setOrderBy] = useState(ob || defaultOrderBy);
  const [orderDirection, setOrderDirection] = useState(
    od || defaultOrderDirection,
  );
  // TODO: Fix typings
  const [filter, setFilter] = useState<FilterParams>({});
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
    searchParams: {
      page,
      orderBy,
      orderDirection,
      filter,
    },
    setters: {
      setPage,
      setOrderBy,
      setOrderDirection,
      setFilter,
    },
  };
}

interface SearchPaginationProps {
  totalCount: number;
  titlesPerPage: number;
  searchParams: SearchParams;
}

const SearchPagination = memo(
  ({
    totalCount,
    titlesPerPage,
    searchParams,
  }: SearchPaginationProps): JSX.Element => {
    return (
      <Pagination
        sx={{ margin: "auto" }}
        color="primary"
        count={Math.ceil(totalCount / titlesPerPage)}
        siblingCount={1}
        page={searchParams.page + 1}
        // onChange={(_e, page) => handlePagination(page - 1)}
        renderItem={(item): JSX.Element => (
          <PaginationItem
            component={Link}
            to={createSearchURL({
              ...searchParams,
              page: item.page,
            })}
            {...item}
          />
        )}
      />
    );
  },
);

interface TitleListProps {
  libraryId: string;
}

export const TitleList = ({
  libraryId,
}: TitleListProps): JSX.Element | null => {
  const history = useHistory();
  const { searchParams, setters } = useSearchParams();
  const { orderBy, orderDirection, filter, page } = searchParams;
  const { setOrderBy, setOrderDirection, setFilter, setPage } = setters;

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
      filter: {
        year: filter.year as number[],
        genre: JSON.stringify(filter.genre),
      },
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
    if (nextTotalCount > 0) {
      setTotalCount(nextTotalCount);
    }
  }, [data?.library?.titles?.totalCount]);

  const edges = data?.library?.titles?.edges || [];
  const titles: Array<typeof edges[0] | undefined> = edges;
  if (loading) {
    titles.push(...new Array(titlesPerPage).fill(undefined));
  }

  const handlePagination = (nextPage: number): void => {
    setPage(nextPage);
    rootRef.current?.scrollTo(0, 0);
    history.push(createSearchURL({ ...searchParams, page: nextPage + 1 }));
  };

  const handleSort = (field: string, direction: string): void => {
    setOrderBy(field);
    setOrderDirection(direction);
    setPage(0);
    rootRef.current?.scrollTo(0, 0);
    history.push(
      createSearchURL({
        ...searchParams,
        page: 1,
        orderBy: field,
        orderDirection: direction,
      }),
    );
  };

  const handleFilter = (filter: FilterParams): void => {
    setFilter(filter);
  };

  return (
    <Container>
      <Grid
        container
        sx={{ pb: 2, pt: 2, mt: 0 }}
        flexDirection="row"
        flexWrap="wrap"
        alignItems="center"
        alignContent="center"
        justifyContent="space-between"
      >
        <Grid item xs={12} md lg>
          {totalCount > 0 ? (
            <Typography>
              Showing {(page * titlesPerPage + 1).toLocaleString()}
              {" - "}
              {((page + 1) * titlesPerPage).toLocaleString()} of{" "}
              {totalCount.toLocaleString()}
            </Typography>
          ) : null}
        </Grid>
        <Grid item flexWrap="nowrap" flexGrow={0} flexShrink={0}>
          <SearchPagination
            totalCount={totalCount}
            titlesPerPage={titlesPerPage}
            searchParams={searchParams}
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
            <FilterButton onFilter={handleFilter} filter={filter} />
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
        <SearchPagination
          totalCount={totalCount}
          titlesPerPage={titlesPerPage}
          searchParams={searchParams}
        />
      </Grid>
    </Container>
  );
};
