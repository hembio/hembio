import LoadingButton from "@material-ui/lab/LoadingButton";
import axios from "axios";
import { ReactNode, useState } from "react";
import { HEMBIO_API_URL } from "~/constants";
import { useStores } from "~/stores";

interface Props {
  children?: ReactNode;
  path: string;
  onDone?(): void;
}

export function RestLoadingButton({
  children,
  path,
  onDone,
}: Props): JSX.Element {
  const [loading, setLoading] = useState(false);
  const { authStore } = useStores();

  const handle = async () => {
    setLoading(true);
    try {
      await axios.get(`${HEMBIO_API_URL}${path}`, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });
    } catch {
      // Ignore
    }
    setLoading(false);
    if (onDone) {
      onDone();
    }
  };

  return (
    <LoadingButton variant="contained" loading={loading} onClick={handle}>
      {children}
    </LoadingButton>
  );
}
