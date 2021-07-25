import { useEffect, useState, memo, useCallback } from "react";
import { useNewlyAddedTitlesQuery } from "../generated/graphql";
import { TitleCarousel } from "./TitleCarousel";
import { TitleEntity } from "~/generated/graphql";

interface Props {
  libraryId: string;
}

type NewlyAddedTitle = Pick<TitleEntity, "id" | "thumb" | "name" | "year">;

export const NewlyAddedList = memo<Props>(
  ({ libraryId }): JSX.Element | null => {
    const [titleMap, setTitleMap] = useState(
      new Map<number, NewlyAddedTitle[]>([]),
    );
    const [page, setPage] = useState<number>(0);
    const [totalCount, setTotalCount] = useState(0);
    const [titlesPerPage, setTitlesPerPage] = useState(6);
    const { data, loading, refetch } = useNewlyAddedTitlesQuery({
      variables: {
        libraryId,
        skip: page * titlesPerPage,
        take: titlesPerPage * 2,
      },
      pollInterval: page === 0 ? 60000 : undefined,
    });

    useEffect(() => {
      const nextTotalCount = data?.library?.newlyAdded?.totalCount || 0;
      if (nextTotalCount > 0 && nextTotalCount !== totalCount) {
        setTotalCount(nextTotalCount);
      }
    }, [data?.library?.newlyAdded?.totalCount]);

    useEffect(() => {
      const titles = data?.library?.newlyAdded;
      if (!loading && titles) {
        setTitleMap(
          (prev) =>
            new Map([
              ...prev,
              [page, titles.edges.slice(0, titlesPerPage)],
              [page + 1, titles.edges.slice(titlesPerPage)],
            ]),
        );
      }
    }, [loading, page, data]);

    const handleTitlesPerPage = useCallback(
      (nextTitlesPerPage: number) => {
        setTitlesPerPage(nextTitlesPerPage);
        if (page > 0) {
          setPage(0);
          refetch();
        }
      },
      [page],
    );

    const handlePageChange = (nextPage: number) => {
      setPage(nextPage);
    };

    const titles: Array<undefined | NewlyAddedTitle> = [
      ...titleMap.values(),
    ].flat();

    if (loading) {
      titles.push(...new Array(titlesPerPage).fill(undefined));
    }

    // const totalPages = Math.ceil(totalCount / 6);

    return (
      <TitleCarousel
        page={page}
        titles={titles}
        totalCount={totalCount}
        titlesPerPage={titlesPerPage}
        loading={loading}
        onTitlesPerPage={handleTitlesPerPage}
        onPageChange={handlePageChange}
      />
    );
  },
);
