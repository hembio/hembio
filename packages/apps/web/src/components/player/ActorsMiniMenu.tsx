import { Tooltip } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuList from "@material-ui/core/MenuList";
import PeopleIcon from "@material-ui/icons/People";
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
