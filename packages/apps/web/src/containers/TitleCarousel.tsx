import { Theme } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { createStyles, makeStyles } from "@mui/styles";
import clsx from "clsx";
import { useCallback, useRef, useState } from "react";
import { TitleCard } from "~/components/TitleCard";
import { TitleEntity } from "~/generated/graphql";
import { useListener } from "~/hooks/useListener";
import { useThrottledCallback } from "~/hooks/useThrottledCallback";
import { useVirtualList } from "~/hooks/useVirtualList";
import { theme } from "~/theme";

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        position: "relative",
        height: "360px",
        width: "100%",
        overflow: "hidden",
        marginLeft: "-" + theme.spacing(1),
        marginTop: "-" + theme.spacing(1),
        "&:hover": {
          "& .prev, & .next": {
            display: "block",
          },
        },
        "& .prev, & .next": {
          display: "none",
          position: "absolute",
          top: 0,
          bottom: 0,
          zIndex: 1001,
          pointerEvents: "none",
          opacity: 0,
          transition: theme.transitions.create("opacity", {
            easing: "ease",
            duration: "200ms",
          }),
          "& .MuiButtonBase-root": {
            height: "90%",
            color: "white",
            background: "transparent",
          },
          "& .MuiSvgIcon-root": {
            filter: "drop-shadow(0 0 2px black)",
          },
          "&.show": {
            pointerEvents: "auto",
            opacity: 1,
          },
        },
        "& > .prev": {
          left: "0",
        },
        "& > .next": {
          right: "0",
        },
      },
      container: {
        padding: theme.spacing(1),
        userSelect: "none",
        "&.animate": {
          transition: theme.transitions.create(["transform"], {
            easing: "ease",
            duration: "200ms",
          }),
        },
      },
      mask: {
        maskImage: "linear-gradient(to right, black 95%, transparent 100%)",
      },
    }),
  { name: "TitleCarousel" },
);

interface TitleCarouselProps {
  titles: Array<
    Pick<TitleEntity, "id" | "thumb" | "name" | "year"> | undefined
  >;
  page: number;
  totalCount: number;
  titlesPerPage: number;
  loading: boolean;
  onTitlesPerPage: (titlesPerPage: number) => void;
  onPageChange: (page: number) => void;
}

export function TitleCarousel({
  page,
  titles,
  totalCount,
  titlesPerPage,
  loading,
  onTitlesPerPage,
  onPageChange,
}: TitleCarouselProps): JSX.Element {
  const classes = useStyles();
  const [titleWidth, setTitleWidth] = useState(200);
  const [titleHeight, setTitleHeight] = useState(360);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<Window>(window);
  const titleRef = useCallback(
    (node) => {
      if (node !== null && wrapperRef.current !== null) {
        const boundingRect = node.getBoundingClientRect();
        setTitleHeight(boundingRect.height);
        setTitleWidth(boundingRect.width);
        calculateTitlesPerPage();
      }
    },
    [wrapperRef],
  );

  const calculateTitlesPerPage = () => {
    if (wrapperRef.current) {
      const nextTitlesPerPage = Math.floor(
        wrapperRef.current.clientWidth / titleWidth,
      );
      onTitlesPerPage(nextTitlesPerPage);
    }
  };

  const handlePageChange = useThrottledCallback(
    (nextPage: number) => {
      if (
        nextPage !== page &&
        nextPage < Math.ceil(totalCount / titlesPerPage) &&
        nextPage >= 0
      ) {
        onPageChange(nextPage);
      }
    },
    [page, loading, onPageChange],
    300,
  );

  useListener<MouseEvent>(
    windowRef,
    "resize",
    () => {
      calculateTitlesPerPage();
    },
    300,
  );

  useListener<WheelEvent>(
    wrapperRef,
    "wheel",
    (e) => {
      if (e.deltaY > 0) {
        handlePageChange(page + 1);
      } else {
        handlePageChange(page - 1);
      }
    },
    300,
  );

  const { list, offsetPages, safeToAnimate } = useVirtualList(titles, {
    totalItems: totalCount,
    itemsPerPage: titlesPerPage - 1,
    page: page,
    delay: 200,
  });

  const totalPages = Math.ceil(totalCount / 6);
  const showPrev = !loading && page > 0;
  const showNext = !loading && page < totalPages;
  const translate =
    (page - offsetPages) * ((titlesPerPage - 1) * (titleWidth + 16));

  return (
    <div
      className={classes.root}
      ref={wrapperRef}
      style={{
        height:
          titleHeight > 0
            ? titleHeight + Number(theme.spacing(1).substr(0, 1))
            : undefined,
      }}
    >
      <div className={clsx({ prev: true, show: showPrev })} style={{}}>
        <Button
          aria-label="previous"
          onClick={() => handlePageChange(page - 1)}
        >
          <NavigateBeforeIcon fontSize="large" />
        </Button>
      </div>
      <div className={clsx({ next: true, show: showNext })}>
        <Button aria-label="next" onClick={() => handlePageChange(page + 1)}>
          <NavigateNextIcon fontSize="large" />
        </Button>
      </div>
      <div className={classes.mask}>
        <Grid
          container
          className={clsx(classes.container, { animate: safeToAnimate })}
          sx={{
            transform: `translate(-${translate}px)`,
            flexWrap: "nowrap",
          }}
        >
          {list.map((title, idx) => {
            return (
              <Grid
                item
                key={title?.id || idx}
                ref={idx == 0 && page === 0 ? titleRef : undefined}
                sx={{ mr: 2 }}
              >
                <TitleCard title={title} />
              </Grid>
            );
          })}
        </Grid>
      </div>
    </div>
  );
}
