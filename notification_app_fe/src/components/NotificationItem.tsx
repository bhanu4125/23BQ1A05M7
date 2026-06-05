// components/NotificationItem.tsx

import React from "react";
import {
  Card, CardContent, Typography, IconButton,
  Chip, Box, Tooltip
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneIcon          from "@mui/icons-material/Done";
import InfoOutlinedIcon  from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon  from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon  from "@mui/icons-material/ErrorOutline";
import { Notification }  from "../api/notificationApi";
import { Log }           from "../utils/logger";

interface Props {
  item:       Notification;
  onMarkRead: (id: string) => void;
  onDelete:   (id: string) => void;
}

const iconMap = {
  info:    { Icon: InfoOutlinedIcon,       color: "#0288d1" },
  success: { Icon: CheckCircleOutlineIcon, color: "#2e7d32" },
  warning: { Icon: WarningAmberIcon,       color: "#ed6c02" },
  error:   { Icon: ErrorOutlineIcon,       color: "#d32f2f" },
};

const NotificationItem: React.FC<Props> = ({ item, onMarkRead, onDelete }) => {
  const { Icon, color } = iconMap[item.type] ?? iconMap.info;

  const handleRead = () => {
    Log("frontend", "info", "component", `user clicked mark-read id=${item.id}`);
    onMarkRead(item.id);
  };

  const handleDelete = () => {
    Log("frontend", "warn", "component", `user clicked delete id=${item.id}`);
    onDelete(item.id);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        opacity:    item.isRead ? 0.65 : 1,
        borderLeft: `4px solid ${color}`,
      }}
    >
      <CardContent sx={{ py: "10px !important", px: 2 }}>
        <Box display="flex" alignItems="flex-start" gap={1.5}>
          <Icon sx={{ color, mt: "2px", flexShrink: 0 }} fontSize="small" />

          <Box flex={1} minWidth={0}>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <Typography
                variant="body2"
                fontWeight={item.isRead ? 400 : 600}
                noWrap
              >
                {item.title}
              </Typography>
              {!item.isRead && (
                <Chip label="new" size="small" color="primary"
                  sx={{ height: 16, fontSize: "0.6rem" }} />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary" display="block">
              {item.message}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {new Date(item.createdAt).toLocaleString()}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={0.5} flexShrink={0}>
            {!item.isRead && (
              <Tooltip title="Mark as read">
                <IconButton size="small" onClick={handleRead} color="primary">
                  <DoneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Delete">
              <IconButton size="small" onClick={handleDelete} sx={{ color: "#d32f2f" }}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationItem;
