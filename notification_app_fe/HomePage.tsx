// pages/HomePage.tsx

import React, { useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Container,
  Box, Button, Chip, CircularProgress, Alert, Divider
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DoneAllIcon           from "@mui/icons-material/DoneAll";
import RefreshIcon           from "@mui/icons-material/Refresh";
import { useNotifications }  from "../hooks/useNotifications";
import NotificationItem      from "../components/NotificationItem";
import CreateForm            from "../components/CreateForm";
import { Log }               from "../utils/logger";

// hardcoded for the eval - in a real app this'd come from auth context
const USER_ID = "user-001";

const HomePage: React.FC = () => {
  const {
    items, loading, error, unreadCount,
    create, markRead, markAllRead, remove, refresh
  } = useNotifications(USER_ID);

  useEffect(() => {
    Log("frontend", "info", "page", "HomePage mounted");
    return () => {
      Log("frontend", "debug", "page", "HomePage unmounted");
    };
  }, []);

  const handleMarkAll = async () => {
    await Log("frontend", "info", "page", "user clicked mark-all-read");
    markAllRead();
  };

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <NotificationsNoneIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} unread`}
              size="small"
              color="error"
              sx={{ mr: 1 }}
            />
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 3, pb: 4 }}>
        <CreateForm userId={USER_ID} onCreate={create} />

        {/* list header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography variant="subtitle2" color="text.secondary">
            {items.length} notification{items.length !== 1 ? "s" : ""}
          </Typography>
          <Box display="flex" gap={1}>
            <Button size="small" startIcon={<RefreshIcon />} onClick={refresh} variant="text">
              Refresh
            </Button>
            {unreadCount > 0 && (
              <Button
                size="small"
                variant="outlined"
                color="success"
                startIcon={<DoneAllIcon />}
                onClick={handleMarkAll}
              >
                Mark all read
              </Button>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {loading && (
          <Box display="flex" justifyContent="center" pt={4}>
            <CircularProgress size={32} />
          </Box>
        )}

        {!loading && error && (
          <Alert severity="error">{error}</Alert>
        )}

        {!loading && !error && items.length === 0 && (
          <Box textAlign="center" pt={5} color="text.disabled">
            <NotificationsNoneIcon sx={{ fontSize: 52 }} />
            <Typography variant="body2" mt={1}>No notifications yet</Typography>
          </Box>
        )}

        {items.map(item => (
          <NotificationItem
            key={item.id}
            item={item}
            onMarkRead={markRead}
            onDelete={remove}
          />
        ))}
      </Container>
    </>
  );
};

export default HomePage;