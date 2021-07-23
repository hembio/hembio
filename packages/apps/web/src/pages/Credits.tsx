import Container from "@material-ui/core/Container";
import { useParams } from "react-router";

export function Credits(): JSX.Element {
  const { titleId } = useParams<{ titleId: string }>();
  return <Container></Container>;
}
