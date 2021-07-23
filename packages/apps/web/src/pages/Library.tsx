import { useParams } from "react-router";
import { TitleList } from "../containers/TitleList";

export const Library = (): JSX.Element => {
  const { libraryId } = useParams<{ libraryId: string; page: string }>();
  return <TitleList libraryId={libraryId} />;
};
