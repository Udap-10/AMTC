"use client";
import PageContainer from "@/app/DashboardLayout/components/container/PageContainer";
import DeleteIcon from "@mui/icons-material/Delete"; // Delete Icon
import MarkAsReadIcon from "@mui/icons-material/Drafts"; // Mark as Read Icon
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";

// Sample notifications with different types (farmer added, animal detections)
const initialNotifications = [
  {
    id: 1,
    message: "A new farmer has been added",
    time: "5 min ago",
    isRead: false,
  },
  { id: 2, message: "Elephant detected", time: "1 hour ago", isRead: false },
  { id: 3, message: "Camera maintenance", time: "2 hours ago", isRead: false },
  {
    id: 4,
    message: "System update available",
    time: "3 hours ago",
    isRead: false,
  },
];

const NotificationPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [openDialog, setOpenDialog] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<
    number | null
  >(null);

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleDeleteNotification = (id: number) => {
    setNotificationToDelete(id);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationToDelete)
    );
    setOpenDialog(false);
    setNotificationToDelete(null);
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    setNotificationToDelete(null);
  };

  return (
    <PageContainer
      title="Notification Page"
      description="Here you can view your notifications"
    >
      <Card sx={{ marginBottom: 2, padding: 2 }}>
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            sx={{ color: "forestgreen", fontWeight: "bold", marginBottom: 2 }}
          >
            Recent Notifications
          </Typography>

          <List>
            {notifications.map((notification) => (
              <div key={notification.id}>
                <ListItem
                  divider
                  sx={{
                    backgroundColor: notification.isRead
                      ? "transparent"
                      : "#b0e892",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <ListItemText
                    primary={notification.message}
                    secondary={`Received: ${notification.time}`}
                  />
                  <IconButton
                    onClick={() => handleMarkAsRead(notification.id)}
                    color={notification.isRead ? "success" : "primary"}
                    size="small"
                    sx={{ marginRight: 1 }}
                    aria-label="Mark as Read"
                  >
                    <MarkAsReadIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteNotification(notification.id)}
                    color="error"
                    size="small"
                    aria-label="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>

          {notifications.length === 0 && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginTop: 2 }}
            >
              No notifications available.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={cancelDelete}
        aria-labelledby="delete-confirmation-dialog"
      >
        <DialogTitle id="delete-confirmation-dialog">
          {"Are you sure you want to delete this notification?"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary">
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default NotificationPage;
