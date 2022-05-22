import Check from "@mui/icons-material/Check";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import { Tooltip } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
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
      setAnchorEl(null);
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
            <MenuList
              sx={{
                minWidth: "180px",
              }}
            >
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
