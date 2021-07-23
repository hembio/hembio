import { Typography, TypographyProps } from "@material-ui/core";
import { styled } from "@material-ui/styles";
import { Link } from "react-router-dom";

const LogoTypography = styled(Typography)({
  fontFamily: "CocosignumCorsivoItalico-Bold",
  marginBottom: "-4px",
  userSelect: "none",
});

export const Logo = ({
  link = true,
  ...props
}: TypographyProps & { link?: boolean }): JSX.Element => (
  <Link to={link ? "/" : ""}>
    <LogoTypography variant="h6" noWrap {...props}>
      hembio
    </LogoTypography>
  </Link>
);
