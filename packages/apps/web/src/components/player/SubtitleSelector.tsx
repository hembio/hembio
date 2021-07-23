import { Tooltip } from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Check from "@material-ui/icons/Check";
import SubtitlesIcon from "@material-ui/icons/Subtitles";
import { Observer } from "mobx-react-lite";
import { memo, useEffect, useState } from "react";
import { ControlButton } from "./ControlButton";

interface Props {
  showUI?: boolean;
}

export const SubtitleSelector = memo(({ showUI }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [showTooltip, setTooltip] = useState(false);

  useEffect(() => {
    if (showUI === false) {
      setTooltip(false);
    }
  }, [showUI]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Observer>
      {() => (
        <>
          <Tooltip
            open={showTooltip}
            onClose={() => setTooltip(false)}
            onOpen={() => setTooltip(true)}
            title={"Subtitles"}
            aria-label="subtitles"
          >
            <ControlButton
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                setAnchorEl(e.currentTarget);
                // playerStore.togglePlayback();
              }}
            >
              <SubtitlesIcon />
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
            <MenuList>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Check />
                </ListItemIcon>
                <ListItemText>Off</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemText inset>English</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemText inset>Swedish</ListItemText>
              </MenuItem>
            </MenuList>
          </Menu>
        </>
      )}
    </Observer>
  );
});
