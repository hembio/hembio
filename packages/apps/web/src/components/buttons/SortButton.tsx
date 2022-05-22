import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";
import Check from "@mui/icons-material/Check";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import { useState } from "react";

interface SortButtonProps {
  onSort: (field: string, direction: string) => void;
  orderBy: string;
  orderDirection: string;
}

const fields = {
  releaseDate: "Release date",
  createdAt: "Date added",
  name: "Name",
  ratingImdb: "iMDB rating",
  ratingRotten: "Rotten rating",
  ratingTrakt: "Trakt rating",
  ratingMetacritic: "Metacritic rating",
};

const directions = {
  ASC: "Ascending",
  DESC: "Descending",
};

export function SortButton({
  orderBy,
  orderDirection,
  onSort,
}: SortButtonProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        aria-label="sort-button"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <SortByAlphaIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "sort-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuList>
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6" color="body1">
              Sort by
            </Typography>
          </Box>
          {Object.entries(fields).map(([field, text]) => (
            <MenuItem
              key={field}
              onClick={() => {
                onSort(field, orderDirection);
                handleClose();
              }}
            >
              {field === orderBy && (
                <ListItemIcon>
                  <Check />
                </ListItemIcon>
              )}
              <ListItemText inset={field !== orderBy}>{text}</ListItemText>
            </MenuItem>
          ))}
          <Box sx={{ ml: 2, mt: 2 }}>
            <Typography variant="h6" color="body1">
              Sort direction
            </Typography>
          </Box>
          {Object.entries(directions).map(([direction, text]) => (
            <MenuItem
              key={direction}
              onClick={() => {
                onSort(orderBy, direction);
                handleClose();
              }}
            >
              {direction === orderDirection && (
                <ListItemIcon>
                  <Check />
                </ListItemIcon>
              )}
              <ListItemText inset={direction !== orderDirection}>
                {text}
              </ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
}
