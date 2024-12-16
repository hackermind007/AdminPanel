import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import { Drawer as MuiDrawer } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import { FolderCopy, MeetingRoom, QuestionMark } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { GridLoader, HashLoader } from "react-spinners";
import { Spinner } from "react-bootstrap";

const drawerWidth = 240;
let pages = [
  {
    name: "Dashboard",
    path: "/admin/",
    icon: <DashboardIcon />,
  },
  {
    name: "Category",
    path: "/admin/category",
    icon: <CategoryIcon />,
  },
  {
    name: "Sub Category",
    path: "/admin/subcategory",
    icon: <FolderCopy />,
  },
  {
    name: "Q & A",
    path: "/admin/qa",
    icon: <QuestionMark />,
  },
];

function ThemeDash(props) {
  const { window, children } = props;
  const [spinner, setspinner] = useState(true)
  const location = useLocation(); 
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const getPageTitle = (pathname) => {
    const matchedPage = pages.find((item) => item.path === pathname);
    return matchedPage ? matchedPage.name : "Page Not Found";
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
  const navigate = useNavigate()

  const Logout = () => {
    localStorage.removeItem("token");
    navigate('/')
  }

  useEffect(() => {
    try {
      if (!localStorage.getItem('token')) {
        navigate('/')
      }
    } catch (error) {
      console.log(error);

    } finally {
      setspinner(false)
    }
  }, [])


  const drawer = (
    <div>
      {/* Interview Portal Header inside the Drawer */}
      <Box
        sx={{
          backgroundColor: "#1976D2", // Blue background
          padding: "17px",
          textAlign: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "20px",
          marginBottom: "16px", // Space below the header
        }}
      >
        Interview Portal
      </Box>

      <Divider />
      <List>
        {pages.map((item, index) => {
          // Check if the current path matches the item's path
          const isActive = location.pathname === item.path;

          return (
            <Link
              to={item.path}
              key={index}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    // Apply background color when the item is active
                    backgroundColor: isActive ? "#1976D2" : "transparent",
                    margin: "10px",
                    borderRadius: "3px",
                    color: isActive ? "white" : "black",
                    "&:hover": {
                      backgroundColor: isActive ? "#1976D2" : "lightgray", // hover effect for active item
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "white" : "",
                    }}
                  >{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            </Link>
          );
        })}
      </List>
      <Divider />
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  if (spinner) {
    return <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div><HashLoader color="#122dff" /></div>
    </div>
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
          </IconButton>
          <Typography variant="h6" noWrap component="div" className="w-100 d-flex justify-content-between align-items-center">
            {getPageTitle(location.pathname)} {/* Display dynamic title */}
            {/* <Link to="/"> */}
            <Button onClick={Logout}>
              <MeetingRoom sx={{ color: "white", fontSize: "30px" }} />
            </Button>
            {/* </Link> */}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <MuiDrawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </MuiDrawer>
        <MuiDrawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </MuiDrawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

ThemeDash.propTypes = {
  window: PropTypes.func,
};

export default ThemeDash;
