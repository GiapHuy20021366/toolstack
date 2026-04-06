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
import { Search, Add, Delete, Restore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { IDeleteGraphicInfo, IRecentGraphicInfo } from "electron/stores/graphic-components-store";

export default function Home() {
  const navigate = useNavigate();

  const [graphics, setGraphics] = useState<IRecentGraphicInfo[]>([]);
  const [deletes, setDeletes] = useState<IDeleteGraphicInfo[]>([]);

  const loadAll = useCallback(() => {
    window.graphicComponentsStoreAPI.graphics.getRecentList().then((dict) => {
      setGraphics(Object.values(dict).sort((g1, g2) => g2.updatedAt - g1.updatedAt));
    });
    window.graphicComponentsStoreAPI.graphics.getDeleteList().then((dict) => {
      setDeletes(Object.values(dict).sort((g1, g2) => g2.deletedAt - g1.deletedAt));
    });
  }, []);
  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteGraphic = async (cid: string) => {
    await window.graphicComponentsStoreAPI.graphics.delete(cid);
    loadAll();
  }

  const handleRevertGraphic = async (cid: string) => {
    await window.graphicComponentsStoreAPI.graphics.revert(cid);
    loadAll();
  }

  const handleRemoveGraphic = async (cid: string) => {
    await window.graphicComponentsStoreAPI.graphics.remove(cid);
    loadAll();
  }

  return (
    <Box display="flex" flexDirection="column" >
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

      {/* Recently */}
      <Box p={3}>
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
                width: 180,
                height: 180,
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
                  height: 180,
                  cursor: "pointer",
                  borderRadius: 3,
                  flexShrink: 0,
                  overflow: "hidden",
                  position: "relative",
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                {/* Delete button */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGraphic(graphic.cid);
                  }}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.7)",
                    },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>

                <CardMedia
                  component="img"
                  height="120"
                  image={graphic.image}
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

      {/* Deleted */}
      <Box overflow="auto" p={3}>
        <Box mb={4}>
          {/* Section title */}
          <Typography variant="h6" mb={2}>
            Deleted
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
            {deletes.map((graphic) => (
              <Card
                key={`${graphic.cid}`}
                sx={{
                  width: 180,
                  height: 180,
                  cursor: "pointer",
                  borderRadius: 3,
                  flexShrink: 0,
                  overflow: "hidden",
                  position: "relative", // quan trọng
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                {/* Action buttons */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    zIndex: 1,
                  }}
                >
                  {/* Revert */}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRevertGraphic(graphic.cid);
                    }}
                    sx={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.7)",
                      },
                    }}
                  >
                    <Restore fontSize="small" />
                  </IconButton>

                  {/* Delete */}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveGraphic(graphic.cid);
                    }}
                    sx={{
                      backgroundColor: "rgba(255,0,0,0.6)",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgba(255,0,0,0.8)",
                      },
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>

                <CardMedia
                  component="img"
                  height="120"
                  image={graphic.image}
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
