// components/CreateForm.tsx

import React, { useState } from "react";
import {
  Paper, Typography, Box, TextField,
  Select, MenuItem, FormControl, InputLabel,
  Button, Alert
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { NotifType, CreatePayload } from "../api/notificationApi";
import { Log } from "../utils/logger";

interface Props {
  userId:   string;
  onCreate: (p: CreatePayload) => Promise<void>;
}

const CreateForm: React.FC<Props> = ({ userId, onCreate }) => {
  const [title,   setTitle]   = useState("");
  const [message, setMessage] = useState("");
  const [type,    setType]    = useState<NotifType>("info");
  const [busy,    setBusy]    = useState(false);
  const [err,     setErr]     = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      setErr("Please fill in both title and message.");
      Log("frontend", "warn", "component", "CreateForm: submit with empty fields");
      return;
    }
    setErr("");
    setBusy(true);
    try {
      await Log("frontend", "info", "component", `CreateForm: submitting type=${type}`);
      await onCreate({ title: title.trim(), message: message.trim(), type, userId });
      setTitle("");
      setMessage("");
      setType("info");
      await Log("frontend", "info", "component", "CreateForm: notification created ok");
    } catch {
      setErr("Failed to create notification, please try again.");
      await Log("frontend", "error", "component", "CreateForm: create request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2.5, mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        New Notification
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Title"
          size="small"
          fullWidth
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <TextField
          label="Message"
          size="small"
          fullWidth
          multiline
          rows={2}
          value={message}
          onChange={e => setMessage(e.target.value)}
        />

        <FormControl size="small" fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            value={type}
            onChange={e => setType(e.target.value as NotifType)}
          >
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="success">Success</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
            <MenuItem value="error">Error</MenuItem>
          </Select>
        </FormControl>

        {err && <Alert severity="error" sx={{ py: 0 }}>{err}</Alert>}

        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleSubmit}
          disabled={busy}
        >
          {busy ? "Sending..." : "Create"}
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateForm;