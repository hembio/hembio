import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { experimentalStyled as styled, alpha } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { useSearchTitlesQuery } from "~/generated/graphql";
import { SearchResult } from "./SearchResult";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(3),
  marginLeft: theme.spacing(1),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("xs")]: {
      width: "15ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));

export function SearchInput(): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const { loading, data } = useSearchTitlesQuery({
    variables: { query },
    skip: query.length < 3,
    nextFetchPolicy: "network-only",
  });

  useEffect(() => {
    if (!focused) {
      inputRef.current?.blur();
    } else {
      inputRef.current?.focus();
    }
  }, [focused]);

  const results = data?.search || [];
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search", ref: inputRef }}
        value={query}
        onClick={(e) => {
          e.preventDefault();
          setFocused(true);
          const input = e.target as HTMLInputElement;
          if (input.selectionStart === input.selectionEnd) {
            input.setSelectionRange(0, query.length);
          }
        }}
        onFocus={() => setFocused(true)}
        onChange={(e) => setQuery(e.target.value)}
      />
      {focused && query.length >= 3 && (
        <SearchResult
          loading={loading}
          results={results}
          inputRef={inputRef}
          onBlur={() => setFocused(false)}
        />
      )}
    </Search>
  );
}
