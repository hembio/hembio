import Container from "@mui/material/Container";
import { useParams } from "react-router-dom";

export function Credits(): JSX.Element {
  const { titleId } = useParams<{ titleId: string }>();
  return <Container></Container>;
}
