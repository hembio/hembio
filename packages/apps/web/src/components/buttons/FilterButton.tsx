import { TitleGenreSlugs } from "@hembio/core";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import FilterList from "@material-ui/icons/FilterList";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FilterParams } from "~/containers/TitleList";

interface SortButtonProps {
  onFilter: (filter: FilterParams) => void;
  filter: FilterParams;
}

type GenreParam = Required<Pick<FilterParams, "genre">>["genre"];

function GenreFilter({ filter, onFilter }: SortButtonProps): JSX.Element {
  const [values, setValues] = useState<GenreParam>(filter.genre || {});
  const { t } = useTranslation("genres");

  const handleChange = (id: string): void => {
    if (!values[id]) {
      values[id] = 0;
    }
    if (values[id] === -1) {
      delete values[id];
    } else if (values[id] === 0) {
      values[id] = 1;
    } else if (values[id] === 1) {
      values[id] = -1;
    }
    setValues({ ...values });
    onFilter({ ...filter, genre: values });
  };

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
      {TitleGenreSlugs.map((genre) => (
        <Box key={genre}>
          <FormControlLabel
            control={
              <Checkbox
                color="secondary"
                indeterminate={values[genre] === -1}
                checked={values[genre] === 1 ? true : false}
                onChange={() => handleChange(genre)}
                name={genre}
                value={genre}
              />
            }
            label={t(genre)}
          />
        </Box>
      ))}
    </Box>
  );
}

type YearParam = Required<Pick<FilterParams, "year">>["year"];

function YearFilter({ filter, onFilter }: SortButtonProps): JSX.Element {
  const currentYear = new Date().getFullYear();
  const [values, setValues] = useState<YearParam>(
    filter.year || [1888, currentYear],
  );

  const handleChange = (_e: Event, nextValues: number | number[]): void => {
    // Note: This is safe to infer to [number, number]
    setValues(nextValues as YearParam);
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
          marks={marks}
          min={marks[0].value}
          max={marks[1].value}
          valueLabelDisplay="on"
          disableSwap
          onChange={handleChange}
          onChangeCommitted={() => {
            // Defer setting the filter a bit
            // so animations have time to finish
            setTimeout(() => {
              onFilter({ ...filter, year: values });
            }, 100);
          }}
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
  const handleClose = (): void => {
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
              display: "grid",
              gridAutoFlow: "column",
              justifyContent: "space-between",
              mt: 1,
              mx: 2,
            }}
          >
            <Typography variant="h6" color="body1">
              Filter by
            </Typography>
            {/* <Button variant="text">Apply</Button> */}
          </Box>
          <YearFilter filter={filter} onFilter={onFilter} />
          <GenreFilter filter={filter} onFilter={onFilter} />
        </Box>
      </Menu>
    </>
  );
}
