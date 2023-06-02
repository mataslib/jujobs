import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import * as React from "react";
import { useUser } from "../../hooks/useUser";
import { Link } from "../Link/Link";

const ResponsiveAppBar = () => {
  const router = useRouter();

  // useEffect(() => {
  //   const handleRouteChange = () => {
  //     handleCloseNavMenu();
  //     handleCloseUserMenu();
  //   };

  //   router.events.on("routeChangeComplete", handleRouteChange);
  //   return () => {
  //     router.events.off("routeChangeComplete", handleRouteChange);
  //   };
  // }, []);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LogoTypeDesktop />
          <NavMenuMobile />
          <LogoTypeMobile />
          <NavMenuDesktop />
          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const LogoTypeDesktop = () => {
  return (
    <Link
      sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
      href="/"
      color="common.white"
    >
      <Typography variant="h6" noWrap component="div">
        Kariéra JČU
      </Typography>
    </Link>
  );
};

const LogoTypeMobile = () => {
  return (
    <Link
      sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
      href="/"
      color="common.white"
    >
      <Typography variant="h6" noWrap component="div">
        Kariéra JČU
      </Typography>
    </Link>
  );
};

const NavMenuDesktop = () => {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
      <Link href="/nabidky/1">
        <Button sx={{ my: 2, color: "white", display: "block" }}>
          nabídka pracovních pozic
        </Button>
      </Link>
      <Link href="/inzerenti/1">
        <Button sx={{ my: 2, color: "white", display: "block" }}>
          inzerenti
        </Button>
      </Link>
    </Box>
  );
};

const NavMenuMobile = () => {
  const [navMenuAnchorEl, setNavMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNavMenuAnchorEl(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setNavMenuAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>

      {/* Nav menu Mobile */}
      <Menu
        id="menu-appbar"
        anchorEl={navMenuAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(navMenuAnchorEl)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        <MenuItem
          component={Link}
          href="/nabidky/1"
          onClick={handleCloseNavMenu}
        >
          <Typography textAlign="center">nabídka pracovních pozic</Typography>
        </MenuItem>
        <MenuItem
          component={Link}
          href="/inzerenti/1"
          onClick={handleCloseNavMenu}
        >
          <Typography textAlign="center">inzerenti</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

const UserMenu = () => {
  const { user, logout } = useUser();
  const [userMenuAnchorEl, setUserMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setUserMenuAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      {user ? (
        <>
          <Tooltip title="Uživatelské menu">
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{ p: 0 }}
              data-user-dropdown
            >
              <Avatar alt="Anonymous" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="appbar-user-menu"
            anchorEl={userMenuAnchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(userMenuAnchorEl)}
            onClose={handleCloseUserMenu}
          >
            {user && user.roles.includes("advertiser") && (
              <AdvertiserMenu closeMenu={handleCloseUserMenu} />
            )}

            {user && user.roles.includes("student") && (
              <StudentMenu closeMenu={handleCloseUserMenu} />
            )}

            <Divider />
            <Typography variant="h5" sx={{ px: 1, color: "gray" }}>
              Uživatel:
            </Typography>
            <MenuItem
              key={"UserData"}
              component={Link}
              href={`/uzivatel/${user.userId}/profil`}
              onClick={handleCloseUserMenu}
            >
              <Typography textAlign="center">Nastavení</Typography>
            </MenuItem>

            <MenuItem
              key={"Logout"}
              onClick={() => {
                logout();
                handleCloseUserMenu();
              }}
            >
              <Typography textAlign="center">Odhlásit</Typography>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Link
          href="/prihlaseni"
          sx={{ my: 2, color: "white", display: "block" }}
        >
          Přihlásit
        </Link>
      )}
    </Box>
  );
};

const StudentMenu = (props: { closeMenu: () => any }) => {
  const { user } = useUser();

  return (
    <>
      <Typography variant="h5" sx={{ px: 1, color: "gray" }}>
        Student:
      </Typography>

      <MenuItem
        component={Link}
        href={`/student/notifikace`}
        onClick={props.closeMenu}
      >
        <Typography textAlign="center">Notifikace</Typography>
      </MenuItem>

      <MenuItem
        component={Link}
        href={`/student/${user.studentId}/profil`}
        onClick={props.closeMenu}
      >
        <Typography textAlign="center">Profil</Typography>
      </MenuItem>
    </>
  );
};

const AdvertiserMenu = (props: { closeMenu: () => any }) => {
  const { user } = useUser();

  return (
    <>
      <Typography variant="h5" sx={{ px: 1, color: "gray" }}>
        Inzerent:
      </Typography>

      <MenuItem
        key={"JobList"}
        component={Link}
        href={`/inzerent/${user.advertiserId}#joblist`}
        onClick={props.closeMenu}
      >
        <Typography textAlign="center">Mé inzeráty</Typography>
      </MenuItem>

      <MenuItem
        key={"Profile"}
        component={Link}
        href={`/inzerent/${user.advertiserId}/profil`}
        onClick={props.closeMenu}
      >
        <Typography
          onClick={() => {
            // alert("click");
            // props.handleCloseUserMenu();
          }}
          textAlign="center"
        >
          Upravit profil
        </Typography>
      </MenuItem>

      <MenuItem
        key={"NewJob"}
        component={Link}
        href={`/inzerent/${user.advertiserId}/nabidka/vytvorit`}
        onClick={props.closeMenu}
      >
        Nový inzerát
      </MenuItem>
    </>
  );
};

export default ResponsiveAppBar;
