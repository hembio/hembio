import { HEMBIO_API_URL } from "../constants";
import { useImage } from "../hooks/useImage";

interface Props {
  id: string;
  name: string;
}

export const TitleLogo = ({ id, name }: Props): JSX.Element | null => {
  const src = `${HEMBIO_API_URL}/images/titles/${id}/logo`;
  const { error } = useImage(src);
  if (error) {
    return null;
  }
  return (
    <img
      src={src}
      alt={`${name} logo`}
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        filter: "drop-shadow(2px 2px 2px rgba(0,0,0,.4))",
      }}
    />
  );
};
