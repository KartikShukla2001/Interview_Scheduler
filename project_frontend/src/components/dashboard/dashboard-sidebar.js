import { useEffect, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import {
  Box,
  Divider,
  Drawer,
  
  useMediaQuery,
} from "@mui/material";
import { Users as UsersIcon } from "../../icons/users";
import { Scrollbar } from "../scrollbar";
import { DashboardSidebarSection } from "./dashboard-sidebar-section";
import { OrganizationPopover } from "./organization-popover";

const getSections = () => [
  {
    title: " ",
    items: [
      {
        title: "Schedule",
        path: "/dashboard",
        icon: <UsersIcon fontSize="small" />,
      },
     
    ],
  },
];

export const DashboardSidebar = (props) => {
  
  const { onClose, open } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    noSsr: true,
  });
  const sections = useMemo(() => getSections(), []);
  const organizationsRef = useRef(null);
  const [openOrganizationsPopover, setOpenOrganizationsPopover] =
    useState(false);

  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }

    if (open) {
      onClose?.();
    }
  };

  useEffect(
    handlePathChange,

    [router.isReady, router.asPath]
  );


  const handleCloseOrganizationsPopover = () => {
    setOpenOrganizationsPopover(false);
  };

  const content = (
    <>
      <Scrollbar
        sx={{
          height: "100%",
          "& .simplebar-content": {
            height: "100%",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <center>
            <NextLink href="/dashboard" passHref>
              <h1>Interview Scheduler</h1>
            </NextLink>
          </center>
        

          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              {sections.map((section) => (
                <DashboardSidebarSection
                  key={section.title}
                  path={router.asPath}
                  sx={{
                    mt: 2,
                    "& + &": {
                      mt: 2,
                    },
                  }}
                  {...section}
                />
              ))}
            </Box>
          </Box>
         
          <Divider
            sx={{
              borderColor: "#2D3748", // dark divider
            }}
          />
        </Box>
      </Scrollbar>
      <OrganizationPopover
        anchorEl={organizationsRef.current}
        onClose={handleCloseOrganizationsPopover}
        open={openOrganizationsPopover}
      />
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            // backgroundColor: 'neutral.900',
            backgroundColor: "#0d0d0f",
            borderRightColor: "divider",
            borderRightStyle: "solid",
            borderRightWidth: (theme) =>
              theme.palette.mode === "dark" ? 1 : 0,
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
