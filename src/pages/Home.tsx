import {
  Box,
  Typography,
  IconButton,
  TextField,
  Avatar,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { Search, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IGraphicComponent } from "@contexts/editor";

export default function Home() {
  const navigate = useNavigate();

  const [graphics, setGraphics] = useState<IGraphicComponent[]>([]);

  useEffect(() => {
    window.graphicComponentsStoreAPI.graphics.getAll().then((dict) => {
      setGraphics(Object.values(dict));
    });
  }, []);

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {/* Topbar */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        p={2}
        borderBottom="1px solid #ddd"
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search in Drive"
          InputProps={{
            startAdornment: <Search />,
          }}
        />

        <IconButton>
          <Add />
        </IconButton>

        <Avatar />
      </Box>

      {/* Content */}
      <Box flex={1} overflow="auto" p={3}>
        <Box mb={4}>
          {/* Section title */}
          <Typography variant="h6" mb={2}>
            Recently
          </Typography>

          {/* Horizontal scroll */}
          <Box
            display="flex"
            gap={2}
            overflow="auto"
            pb={1}
            sx={{
              "&::-webkit-scrollbar": { height: 6 },
            }}
          >
            <Card
              onClick={() => navigate("/editor/new")}
              sx={{
                minWidth: 180,
                cursor: "pointer",
                borderRadius: 3,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #ccc",
                "&:hover": {
                  boxShadow: 4,
                  borderColor: "primary.main",
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={1}
                >
                  <Add color="primary" />
                  <Typography variant="body2">Add New</Typography>
                </Box>
              </CardContent>
            </Card>

            {graphics.map((graphic) => (
              <Card
                key={graphic.cid}
                onClick={() => navigate(`/editor/${graphic.cid}`)}
                sx={{
                  width: 180,
                  cursor: "pointer",
                  borderRadius: 3,
                  flexShrink: 0,
                  overflow: "hidden",
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="120"
                  image={`images://${graphic.image}`}
                  alt={graphic.name}
                />

                <CardContent sx={{ p: 1 }}>
                  <Typography variant="body2" noWrap textAlign="center">
                    {graphic.name}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
