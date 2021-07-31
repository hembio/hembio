import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import FilterList from "@material-ui/icons/FilterList";
import { useState } from "react";
import { useGenresQuery } from "~/generated/graphql";

interface SortButtonProps {
  onFilter: (filter: Record<string, any>) => void;
  filter: Record<string, any>;
}

function GenreFilter({ filter, onFilter }: SortButtonProps) {
  const [values, setValues] = useState<Record<string, number>>({});
  const { data } = useGenresQuery();

  const handleChange = (slug: string) => {
    if (!values[slug]) {
      values[slug] = 0;
    }
    if (values[slug] === -1) {
      delete values[slug];
    } else if (values[slug] === 0) {
      values[slug] = 1;
    } else if (values[slug] === 1) {
      values[slug] = -1;
    }
    setValues({ ...values });
    onFilter({ genre: values });
  };

  const genres = data?.genres || new Array(27).fill(undefined);
  return (
    <Box
      sx={{
        m: 3,
        mt: 0,
        mb: 1,
        display: "grid",
        gap: 1,
        gridAutoFlow: "row",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        justifyItems: "stretch",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          gridColumn: "1 / -1",
          display: "grid",
          gridAutoFlow: "column",
        }}
      >
        <Typography variant="h6" color="body1">
          Genres
        </Typography>
      </Box>
      {genres.map((genre, idx) => (
        <Box key={genre ? genre.slug : idx}>
          <FormControlLabel
            control={
              <Checkbox
                color="secondary"
                indeterminate={values[genre?.slug] === -1}
                checked={values[genre?.slug] === 1 ? true : false}
                onChange={() => handleChange(genre?.slug)}
                name={genre ? genre.slug : ""}
                value={genre ? genre.id : ""}
              />
            }
            label={genre ? genre.name : ""}
          />
        </Box>
      ))}
    </Box>
  );
}

function YearFilter({ filter, onFilter }: SortButtonProps) {
  const currentYear = new Date().getFullYear();
  const [values, setValues] = useState<[number, number]>([1888, currentYear]);

  const handleChange = (_e: Event, nextValues: number | number[]) => {
    // Note: This is safe to infer to [number, number]
    setValues(nextValues as [number, number]);
  };

  const marks = [
    {
      value: 1888,
      label: 1888,
    },
    {
      value: currentYear,
      label: currentYear,
    },
  ];

  return (
    <Box
      sx={{
        m: 3,
        mt: 1,
        mb: 0,
      }}
    >
      <Box>
        <Typography variant="h6" color="body1">
          Year
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Slider
          getAriaLabel={() => "Year filter range"}
          color="secondary"
          value={values}
          onChange={handleChange}
          marks={marks}
          min={marks[0].value}
          max={marks[1].value}
          valueLabelDisplay="on"
          disableSwap
        />
      </Box>
    </Box>
  );
}

export function FilterButton({
  filter,
  onFilter,
}: SortButtonProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="filter-button"
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
        <Box sx={{ width: "750px" }}>
          <Box
            sx={{
              mt: 1,
              ml: 3,
            }}
          >
            <Typography variant="h6" color="body1">
              Filter by
            </Typography>
          </Box>
          <YearFilter filter={filter} onFilter={onFilter} />
          <GenreFilter filter={filter} onFilter={onFilter} />
        </Box>
      </Menu>
    </>
  );
}
