import { Tooltip } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import PeopleIcon from "@mui/icons-material/People";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { CreditListitem } from "../CreditListItem";
import { ControlButton } from "./ControlButton";
import { useStores } from "~/stores";

interface Props {
  showUI?: boolean;
}

export const ActorsMiniMenu = observer(({ showUI }: Props) => {
  const { playerStore } = useStores();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [showTooltip, setTooltip] = useState(false);

  useEffect(() => {
    if (showUI === false) {
      setTooltip(false);
      setAnchorEl(null);
    }
  }, [showUI]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const credits = playerStore.file?.title?.topBilling || [];
  return (
    <>
      <Tooltip
        open={showTooltip}
        onClose={() => setTooltip(false)}
        onOpen={() => setTooltip(true)}
        title={"Starring"}
        aria-label="starring"
      >
        <ControlButton
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
            // playerStore.togglePlayback();
          }}
        >
          <PeopleIcon />
        </ControlButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuList
          sx={{
            minWidth: "180px",
          }}
        >
          {credits.map((credit) => (
            <CreditListitem key={credit.id} credit={credit} />
          ))}
        </MenuList>
      </Menu>
    </>
  );
});
