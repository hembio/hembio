import Typography, { TypographyProps } from "@material-ui/core/Typography";
import { styled } from "@material-ui/system";
import { Link } from "react-router-dom";

const LogoTypography = styled(Typography)({
  fontFamily: "CocosignumCorsivoItalico-Bold",
  marginBottom: "-4px",
  marginLeft: "-4px",
  userSelect: "none",
});

export const Logo = ({
  link = true,
  ...props
}: TypographyProps & { link?: boolean }): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyProps = props as any;
  return (
    <Link to={link ? "/" : ""}>
      <LogoTypography variant="h6" noWrap {...anyProps}>
        hembio
      </LogoTypography>
    </Link>
  );
};
