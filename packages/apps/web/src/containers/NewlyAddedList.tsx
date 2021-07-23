import { useCallback, useEffect, useState, memo } from "react";
import { useNewlyAddedTitlesQuery } from "../generated/graphql";
import { TitleCarousel } from "./TitleCarousel";
import { TitleEntity } from "~/generated/graphql";

interface Props {
  libraryId: string;
}

export const NewlyAddedList = memo<Props>(
  ({ libraryId }): JSX.Element | null => {
    const [titleMap, setTitleMap] = useState(new Map<number, TitleEntity>());
    const [page, setPage] = useState<number>(0);
    const [totalCount, setTotalCount] = useState(0);
    const [titlesPerPage, setTitlesPerPage] = useState(6);
    const { data, loading } = useNewlyAddedTitlesQuery({
      variables: {
        libraryId,
        skip: page * titlesPerPage,
        take: titlesPerPage,
      },
      pollInterval: 60000,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setTitleMap((prev) => new Map([...prev, [page, titles.edges as any]]));
      }
    }, [loading, page, data]);

    const handleTitlesPerPage = useCallback((nextTitlesPerPage: number) => {
      if (nextTitlesPerPage !== titlesPerPage) {
        setTitlesPerPage(nextTitlesPerPage);
      }
    }, []);

    const handlePageChange = (nextPage: number) => {
      setPage(nextPage);
    };

    const titles: Array<undefined | TitleEntity> = [
      ...titleMap.values(),
    ].flat();

    if (loading) {
      titles.push(...new Array(8).fill(undefined));
    }

    // const totalPages = Math.ceil(totalCount / 6);

    return (
      <TitleCarousel
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
