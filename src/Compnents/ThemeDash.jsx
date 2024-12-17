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
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import { FolderCopy, MeetingRoom, QuestionMark } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { HashLoader } from "react-spinners";

const drawerWidth = 240;

const pages = [
  { name: "Dashboard", path: "/admin/", icon: <DashboardIcon /> },
  { name: "Category", path: "/admin/category", icon: <CategoryIcon /> },
  { name: "Sub Category", path: "/admin/subcategory", icon: <FolderCopy /> },
  { name: "Q & A", path: "/admin/qa", icon: <QuestionMark /> },
];

function ThemeDash(props) {
  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [spinner, setSpinner] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = (pathname) => {
    const matchedPage = pages.find((item) => item.path === pathname);
    return matchedPage ? matchedPage.name : "Page Not Found";
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
    setSpinner(false);
  }, [navigate]);

  const drawer = (
    <Box>
      <Box
        sx={{
          backgroundColor: "#1976D2",
          padding: "16px",
          textAlign: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        Interview Portal
      </Box>
      <Divider />
      <List>
        {pages.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => setMobileOpen(false)} // Close drawer on mobile after navigation
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  backgroundColor:
                    location.pathname === item.path ? "#1976D2" : "transparent",
                  color: location.pathname === item.path ? "white" : "black",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "#1976D2",
                    color:"white"
                  },
                }}
              >
                <ListItemIcon
                  sx={{ color: location.pathname === item.path ? "white" : "inherit" }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
    </Box>
  );

  if (spinner) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HashLoader color="#122dff" />
      </Box>
    );
  }

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: 1201, // Keep AppBar above the Drawer
        }}
      >
        <Toolbar>
          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {getPageTitle(location.pathname)}
          </Typography>
          <Button onClick={Logout}>
            <MeetingRoom sx={{ color: "white", fontSize: "30px" }} />
          </Button>
        </Toolbar>
      </AppBar>

      {/* Responsive Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="menu items"
      >
        {/* Mobile Drawer */}
        <MuiDrawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </MuiDrawer>

        {/* Permanent Drawer */}
        <MuiDrawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </MuiDrawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar /> {/* AppBar spacer */}
        {children}
      </Box>
    </Box>
  );
}

ThemeDash.propTypes = {
  window: PropTypes.func,
};

export default ThemeDash;