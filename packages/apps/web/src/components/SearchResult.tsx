import { TitleGenreLiterals } from "@hembio/core/src";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import { experimentalStyled as styled } from "@mui/material/styles";
import { RefObject, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { PosterImage } from "./PosterImage";
import weAintFoundShit from "$/we-aint-found-shit.jpg";
import { SearchTitleFragment } from "~/generated/graphql";
import { useElementKeyboardNavigation } from "~/hooks/useElementKeyboardNavigation";

const Results = styled(Paper)(() => ({
  position: "absolute",
  top: "39px",
  left: "0",
  userSelect: "none",
  width: "30vw",
}));

interface SearchResultProps {
  loading: boolean;
  results: SearchTitleFragment[];
  inputRef: RefObject<HTMLInputElement>;
  onBlur: () => void;
}

export function SearchResult({
  loading,
  inputRef,
  results,
  onBlur,
}: SearchResultProps): JSX.Element {
  const { t } = useTranslation("genres");
  const listRef = useRef<HTMLUListElement>(null);
  useOnClickOutside(listRef, onBlur, [inputRef.current]);
  useElementKeyboardNavigation(listRef);
  const skeletons = new Array(8).fill(undefined);
  return (
    <Results onClick={onBlur}>
      <nav aria-label="search results">
        <List sx={{ width: "100%" }} ref={listRef}>
          {loading &&
            skeletons.map((s, idx) => (
              <ListItem key={`skeleton-${idx}`} disablePadding>
                <ListItemButton>
                  <ListItemAvatar>
                    <Skeleton variant="rectangular" width={35} height={50} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Skeleton
                        animation="wave"
                        variant="text"
                        width={Math.floor(Math.random() * 140) + 80}
                      />
                    }
                    secondary={
                      <Skeleton animation="wave" variant="text" width={50} />
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          {!loading &&
            results &&
            results.map((title) => (
              <ListItem key={title.id} disablePadding>
                <ListItemButton component={Link} to={`/title/${title.id}`}>
                  <ListItemAvatar>
                    <PosterImage
                      id={title.id}
                      thumbnail={title.thumb}
                      size="tiny"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={title.name}
                    secondary={
                      <>
                        {title.year}{" "}
                        {title.runtime
                          ? `\u00A0\u00A0\u00A0${title.runtime} mins`
                          : ""}
                        {"\u00A0\u00A0\u00A0"}
                        {title.genres
                          .map((g) => t(g.slug as TitleGenreLiterals))
                          .join(", ")}
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          {!loading && results.length === 0 && (
            <ListItem>
              <ListItemAvatar>
                <img
                  src={weAintFoundShit}
                  alt="We ain't found shit!"
                  width="40"
                />
              </ListItemAvatar>
              <ListItemText primary={"We ain't found shit!"} />
            </ListItem>
          )}
        </List>
      </nav>
    </Results>
  );
}
