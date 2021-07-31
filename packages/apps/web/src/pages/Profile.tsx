import Container from "@material-ui/core/Container";
import { useStores } from "../stores";

export function Profile(): JSX.Element {
  const { authStore } = useStores();
  return (
    <Container>
      <img src={authStore.qrCode} alt="TFA QR code" />
    </Container>
  );
}
