import { MoreVert } from '@mui/icons-material';
import { Button, createTheme, ListItemIcon, Menu, MenuItem, ThemeOptions, ThemeProvider } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { Action } from 'src/queries';

const ActionModal: React.FC<Props> = ({ actionsMenu, onClick }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickItem = (title: string) => {
    onClick(title);
    handleClose();
  };

  const getMuiTheme = () =>
    createTheme({
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              paddingTop: '0px',
            },
          },
        },
        MuiButtonBase: {
          styleOverrides: {
            root: {
              fontSize: '14px !important',
              fontWeight: 450,
            },
          },
        },
        MuiTouchRipple: {
          styleOverrides: {
            root: {
              paddingLeft: 30,
            },
          },
        },
      },
    } as ThemeOptions);

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <Box onClick={(e) => e.stopPropagation()}>
        <Button
          variant="text"
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <MoreVert />
        </Button>
        <Menu onClose={handleClose} anchorEl={anchorEl} open={open}>
          {actionsMenu.map(
            ({ title, icon, isHidden }, index) =>
              !isHidden && (
                <MenuItem key={index} onClick={() => handleClickItem(title)}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  {title}
                </MenuItem>
              ),
          )}
        </Menu>
      </Box>
    </ThemeProvider>
  );
};

type Props = {
  actionsMenu: Action[];
  onClick: Function;
};

export default ActionModal;
