import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  load: (key: string) => void;
  onClose: () => void;
}

interface IGraphicSelectOption {
  name: string;
  key: string;
  time: string;
}

export const GraphicSelectDialog: React.FC<Props> = ({
  open,
  load,
  onClose,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [options, setOptions] = useState<IGraphicSelectOption[]>([]);

  useEffect(() => {
    if (!open) return;

    window.graphicComponentsStoreAPI.graphics.getAll().then((dict) => {
      const options: IGraphicSelectOption[] = [];
      for (const value of Object.values(dict)) {
        options.push({
          key: value.cid,
          name: value.name,
          time: new Date(value.time).toUTCString(),
        });
      }
      setOptions(options);
      setSelectedKey(options[0]?.key ?? "");
    });
  }, [open]);

  const handleLoad = () => {
    if (!selectedKey) return;
    load(selectedKey);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select Graphic</DialogTitle>

      <DialogContent>
        {options.length === 0 ? (
          <Typography>No saved records</Typography>
        ) : (
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="graphic-select-label">Saved Graphics</InputLabel>

            <Select
              labelId="graphic-select-label"
              value={selectedKey}
              label="Saved Graphics"
              onChange={(e) => setSelectedKey(e.target.value as string)}
            >
              {options.map((option) => (
                <MenuItem key={option.key} value={option.key}>
                  {option.name} ({option.time})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleLoad}
          disabled={!selectedKey}
        >
          Load
        </Button>
      </DialogActions>
    </Dialog>
  );
};
