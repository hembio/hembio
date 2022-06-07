import { useParams } from "react-router-dom";
import { TitleList } from "../containers/TitleList";

export const Library = (): JSX.Element => {
  const { libraryId } = useParams<{ libraryId: string; page: string }>();

  console.log("LibraryId", libraryId);
  return <TitleList libraryId={libraryId || ""} />;
};
