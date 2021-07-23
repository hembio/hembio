import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Typography from "@material-ui/core/Typography";
import Check from "@material-ui/icons/Check";
import FilterList from "@material-ui/icons/FilterList";
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
  ratingImdb: "Rating",
};

const directions = {
  ASC: "Ascending",
  DESC: "Descending",
};

export function FilterButton({
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
        <FilterList />
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
