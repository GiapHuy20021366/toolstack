import { Box, IconButton, Tooltip } from "@mui/material";
import { Home, ArrowBack } from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();

  return (
    <Box display="flex" height="100vh">
      {/* Sidebar */}
      <Box
        width={64}
        bgcolor="#1e1e1e"
        display="flex"
        flexDirection="column"
        alignItems="center"
        py={1}
        gap={1}
      >
        <Tooltip title="Home">
          <IconButton onClick={() => navigate("/")}>
            <Home sx={{ color: "#fff" }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Back">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack sx={{ color: "#fff" }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Content */}
      <Box flex={1} overflow="hidden">
        <Outlet />
      </Box>
    </Box>
  );
}
