import Box from "@mui/material/Box";
import MuiRating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

export function Rating({ rating = 0 }: { rating?: number }): JSX.Element {
  const value = Math.round(rating) / 2;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mt: 0.6,
        mr: -3,
        ml: 2,
      }}
    >
      <MuiRating
        name="text-feedback"
        value={value}
        readOnly
        size="large"
        precision={0.5}
        emptyIcon={
          <StarIcon
            style={{ opacity: 0.55, color: "rgba(0,0,0, .95)" }}
            fontSize="inherit"
          />
        }
      />
    </Box>
  );
}
